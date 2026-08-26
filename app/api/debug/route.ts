import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "";
  return NextResponse.json({
    backendUrl: backendUrl || "NOT SET",
    hasBackendUrl: !!backendUrl,
    nodeEnv: process.env.NODE_ENV,
  });
}
