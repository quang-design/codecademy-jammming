import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const urlParams = new URLSearchParams(request.url);
  const code = urlParams.get("code");

  console.log(code);

  return NextResponse.json({ code });
}
