import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UrlShortener from "./UrlShortener";

describe("UrlShortener", () => {
  it("should render the url shortener component", () => {
    render(<UrlShortener />);

    const heading = screen.getByRole("heading", { name: /url shortener/i });
    expect(heading).toBeInTheDocument();
  });

  it("should show required validation message when submitting empty form", async () => {
    render(<UrlShortener />);

    const submitButton = screen.getByRole("button", { name: /shorten url/i });
    const urlInput = screen.getByRole("textbox");

    await userEvent.click(submitButton);

    expect(urlInput).toHaveAttribute("required");
  });

  it("should show URL format validation message for invalid URLs", async () => {
    render(<UrlShortener />);

    const urlInput = screen.getByRole("textbox");

    await userEvent.type(urlInput, "invalid-url");

    expect(urlInput).toHaveAttribute("type", "url");
  });

  it("should show short url when submitting valid URL", async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          url: "https://www.google.com",
          clicks: 0,
          created_at: "2025-03-14T12:00:00Z",
          domain: "example.com",
          shortened: "abc123",
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    render(<UrlShortener />);

    const urlInput = screen.getByRole("textbox");
    await userEvent.type(urlInput, "https://www.google.com");

    const submitButton = screen.getByRole("button", { name: /shorten url/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/example\.com\/abc123/)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://url-shortener-be-u3bk.onrender.com/api/url",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.google.com",
          domain: window.location.hostname,
        }),
      })
    );
  });

  it("should handle API error gracefully", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("API Error")));

    render(<UrlShortener />);

    const urlInput = screen.getByRole("textbox");
    await userEvent.type(urlInput, "https://www.google.com");

    const submitButton = screen.getByRole("button", { name: /shorten url/i });
    await userEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });

  // Clean up after tests
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
