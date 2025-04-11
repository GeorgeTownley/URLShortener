"use client";

import { useState, FormEvent } from "react";
import { createShortUrl } from "./actions";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setMessage("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      const { key } = await createShortUrl(longUrl);
      setMessage(`Created short URL with key: ${key} (expires in 24h)`);
      console.log(`Stored long URL: ${longUrl} with key: ${key}`);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating short URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="longUrl" className="block text-sm font-medium mb-2">
            Enter Long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/to/shorten"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Short URL"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md w-full max-w-md">
          {message}
        </div>
      )}
    </div>
  );
}
