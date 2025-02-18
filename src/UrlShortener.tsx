import { useState, type FormEvent } from "react";

export type ShortenedUrl = {
  id: number;
  url: string;
  clicks: number;
  created_at: string;
  domain: string;
  shortened: string;
};

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://url-shortener-be-u3bk.onrender.com/api/url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, domain: window.location.hostname }),
        }
      );

      if (!response.ok) throw new Error("Failed to shorten URL");

      const data = await response.json();

      setShortenedUrl(data.data[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 text-red-500 bg-red-100 rounded">{error}</div>
      )}

      {shortenedUrl && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="font-medium">Shortened URL:</p>
          <a
            href={`https://${shortenedUrl.domain}/${shortenedUrl.shortened}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {`https://${shortenedUrl.domain}/${shortenedUrl.shortened}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
