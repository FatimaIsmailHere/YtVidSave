import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "";
  return NextResponse.json({
    backendUrl: backendUrl ? `${backendUrl.substring(0, 20)}...` : "NOT SET",
    hasBackendUrl: !!backendUrl,
    nodeEnv: process.env.NODE_ENV,
  });
}
