import { redirect } from "next/navigation";
import { redis } from "../../lib/redis";

interface PageProps {
  params: Promise<{ shortcode: string }>;
}

export default async function ShortcodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const shortcode = resolvedParams.shortcode;

  const key = `url:${shortcode}`;

  let originalUrl;
  try {
    originalUrl = await redis.get(key);
  } catch (error) {
    console.error("Redis error:", error);
    // If Redis fails, show 404
  }

  if (originalUrl && typeof originalUrl === "string") {
    // Don't wrap redirect in try/catch - it needs to throw to work
    redirect(originalUrl);
  }

  // If no URL found or expired, show 404-like page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Short URL Not Found</h2>
        <p className="text-gray-600 mb-4">
          This short URL doesn't exist or has expired.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Create New Short URL
        </a>
      </div>
    </div>
  );
}
