import { NextResponse } from "next/server";

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const BASE_URL = "https://open.er-api.com/v6/latest/USD";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}`);
    const data = await response.json();

    if (data.result === "error") {
      throw new Error(data["error-type"]);
    }

    return NextResponse.json({
      rate: data.rates.CNY,
      timestamp: data.time_last_update_unix,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
