"use client";

import { useState, FormEvent } from "react";
import { createShortUrl } from "./actions";
import { BackgroundBeams } from "./components/background-beams";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [message, setMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setMessage("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      const { key, id } = await createShortUrl(longUrl);
      const fullShortUrl = `${window.location.origin}/${id}`;
      setShortUrl(fullShortUrl);
      setMessage(`Short URL created successfully! (expires in 24h)`);
      console.log(`Stored long URL: ${longUrl} with key: ${key}`);
    } catch (error: unknown) {
      console.error("Error:", error);
      const err = error as Error;

      if (err.message?.includes("Daily limit")) {
        setMessage(`Rate limit reached: ${err.message}`);
      } else if (err.message?.includes("exceeded")) {
        setMessage(
          "Daily URL creation limit has been reached. Please try again tomorrow."
        );
      } else {
        setMessage("Error creating short URL. Please try again.");
      }

      setShortUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        setMessage("Short URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
        setMessage("Failed to copy URL to clipboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 relative flex antialiased">
      <BackgroundBeams />
      <div className="max-w-2xl mx-auto p-4 relative z-10 w-full pt-20 md:pt-0">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-12 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight font-sans tracking-tight text-white">
              George&apos;s
              <br />
              URL Shortener
            </h1>
            <p className="text-base sm:text-lg text-white/60 max-w-md mx-auto leading-snug font-light">
              Transform long URLs into short, shareable links. Fast, secure, and
              reliable.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg">
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
                  id="longUrl"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/to/shorten"
                  className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-sm sm:text-base text-white placeholder-white/60"
                  required
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

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm ${
                  message.includes("Error") ||
                  message.includes("limit") ||
                  message.includes("Rate limit")
                    ? "bg-red-500/20 text-red-200 border-2 border-red-500/30"
                    : message.includes("copied")
                    ? "bg-blue-500/20 text-blue-200 border-2 border-blue-500/30"
                    : "bg-green-500/20 text-green-200 border-2 border-green-500/30"
                }`}
              >
                {message}
              </div>
            )}

            {shortUrl && (
              <div className="p-4 sm:p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                <label className="block text-sm font-medium mb-3 text-white/90">
                  Your Short URL:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 p-3 bg-white/10 border-2 border-white/30 rounded-lg text-sm break-all text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-300 hover:text-blue-100 text-sm underline transition-colors duration-200"
                >
                  Test your short URL →
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-white/60 text-xs sm:text-sm">
            <p>URLs expire after 24 hours • Daily limit: 10,000 URLs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
