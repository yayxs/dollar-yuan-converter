"use client";
import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [usd, setUsd] = useState("");
  const [cny, setCny] = useState("");
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/exchange-rate");
      if (!response.ok) throw new Error("Failed to fetch exchange rate");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRate(data.rate);
      return data.rate;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    const currentRate = rate || (await fetchExchangeRate());
    if (!currentRate) return;

    const usdAmount = parseFloat(usd);
    if (isNaN(usdAmount)) {
      setError("Please enter a valid USD amount");
      return;
    }

    setCny((usdAmount * currentRate).toFixed(2));
  };

  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60 * 1000); // 每分钟更新
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        USD to CNY Exchange Rate Converter
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">USD Amount</label>
          <input
            type="number"
            value={usd}
            onChange={(e) => setUsd(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter USD amount"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">CNY Amount</label>
          <input
            type="text"
            readOnly
            value={cny ? `¥ ${cny}` : ""}
            className="w-full p-2 border rounded-md bg-gray-50"
            placeholder="Conversion Result"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            {rate ? (
              <span>当前汇率：1 USD = {rate.toFixed(4)} CNY</span>
            ) : (
              <span className="text-gray-500">Fetching exchange rate...</span>
            )}
          </div>
          <button
            onClick={fetchExchangeRate}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <ArrowPathIcon
              className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Rate
          </button>
        </div>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert Now"}
        </button>
      </div>
    </main>
  );
}
