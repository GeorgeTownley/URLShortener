// short-url-form.tsx
import { FormEvent } from "react";
import { createShortUrl } from "../actions";

type ShortUrlFormProps = {
  onUrlCreated: (shortUrl: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
  isLoading: boolean;
};

export const ShortUrlForm = ({
  onUrlCreated,
  onLoadingChange,
  onError,
  onSuccess,
  isLoading,
}: ShortUrlFormProps) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const longUrl = formData.get("longUrl")?.toString() || "";

    if (!longUrl.trim()) {
      onError("Please enter a URL");
      return;
    }

    try {
      onLoadingChange(true);
      onError(""); // Clear any previous errors

      const { key, id } = await createShortUrl(longUrl);
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_BASE_URL || "https://townsshorturls.app";

      const shortUrl = `${baseUrl}/${id}`;
      onUrlCreated(shortUrl);
      onSuccess("Short URL created successfully! (expires in 24h)");

      console.log(`Stored long URL: ${longUrl} with key: ${key}`);
    } catch (error: unknown) {
      console.error("Error:", error);
      const err = error as Error;

      if (err.message?.includes("Daily limit")) {
        onError(`Rate limit reached: ${err.message}`);
      } else if (err.message?.includes("exceeded")) {
        onError(
          "Daily URL creation limit has been reached. Please try again tomorrow."
        );
      } else {
        onError("Error creating short URL. Please try again.");
      }

      onUrlCreated(""); // Clear the short URL on error
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-6">
        <label
          htmlFor="longUrl"
          className="block text-sm font-medium mb-3 text-white/90"
        >
          Enter Long URL
        </label>
        <input
          type="url"
          name="longUrl"
          placeholder="https://example.com/very/long/url/to/shorten"
          className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-sm sm:text-base text-white placeholder-white/60"
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Short URL"}
      </button>
    </form>
  );
};
