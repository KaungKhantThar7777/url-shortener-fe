import "./App.css";
import UrlShortener, { ShortenedUrl } from "./UrlShortener";
import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.length > 1) {
      setIsLoading(true);
      const shortCode = path.slice(1);

      fetch(`https://url-shortener-be-u3bk.onrender.com/api/url/${shortCode}`)
        .then((response) => response.json())
        .then((data: ShortenedUrl) => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            setError("URL not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching redirect URL:", error);
          setError("Failed to fetch URL");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading) return <div>Redirecting...</div>;
  if (error) return <div>{error}</div>;
  if (window.location.pathname === "/") return <UrlShortener />;

  return null;
}

export default App;
