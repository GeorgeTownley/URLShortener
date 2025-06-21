// homepage.tsx
"use client";

import { useState } from "react";
import { ShortUrlForm } from "../components/short-url-form";
import { BackgroundBeams } from "../components/background-beams";

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlCreated = (url: string) => {
    setShortUrl(url);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setMessage(errorMessage);
  };

  const handleSuccess = (successMessage: string) => {
    setMessage(successMessage);
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        console.log(shortUrl);
        setMessage("Short URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
        setMessage("Failed to copy URL to clipboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 relative flex antialiased overflow-hidden">
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
            <ShortUrlForm
              onUrlCreated={handleUrlCreated}
              onLoadingChange={handleLoadingChange}
              onError={handleError}
              onSuccess={handleSuccess}
              isLoading={isLoading}
            />

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
