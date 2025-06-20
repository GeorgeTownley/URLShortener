import { redirect } from "next/navigation";
import { redis } from "../../lib/redis";
import { BackgroundBeams } from "../components/background-beams";
import Link from "next/link";

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
  }

  if (originalUrl && typeof originalUrl === "string") {
    redirect(originalUrl);
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative flex antialiased">
      <BackgroundBeams />
      <div className="max-w-2xl mx-auto p-4 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-4">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
              Short URL Not Found
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
              This short URL doesn&apos;t exist or has expired. URLs are
              automatically deleted after 24 hours.
            </p>
            <link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create New Short URL
            </link>
          </div>
        </div>
      </div>
    </div>
  );
}
