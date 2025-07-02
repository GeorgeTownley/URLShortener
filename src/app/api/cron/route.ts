import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timestamp = new Date().toISOString();

    await redis.set("keep-alive", {
      timestamp,
      message: "Keep-alive ping",
      source: "vercel-cron",
    });

    console.log(`Keep-alive ping successful at ${timestamp}`);

    return NextResponse.json({
      success: true,
      timestamp,
      message: "Keep-alive ping completed",
    });
  } catch (error) {
    console.error("Keep-alive ping failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
