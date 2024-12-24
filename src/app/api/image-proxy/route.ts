import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // Validate the URL
  if (!url || !url.startsWith("https://cloud.appwrite.io/v1/storage/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check user authentication (replace with your logic)
  const isAuthenticated = true; // Example: Check session, token, or header
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const cookie = request.headers.get("cookie");

  const token = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("appwrite-session="))
    ?.split("=")[1];
  try {
    // Fetch the file from Appwrite
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass user's JWT token
      },
    });

    console.log("🚀 ~ GET ~ response:", response);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error fetching image" },
        { status: response.status },
      );
    }

    // Return the file as a stream
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const fileStream = response.body;

    return new Response(fileStream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store", // Optional: Prevent caching
      },
    });
  } catch (error) {
    console.error("Error proxying the image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
