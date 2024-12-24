import { getFileByBucketFileId } from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { constructDownloadUrl, constructFileUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const download = searchParams.get("download");

  // Validate the URL
  if (!fileId) {
    return NextResponse.json({ error: "Invalid FileId" }, { status: 400 });
  }

  const file = await getFileByBucketFileId(fileId);
  console.log("🚀 ~ GET ~ file:", file);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { error, ...currentUser } = await getCurrentUser();
  console.log("🚀 ~ GET ~ currentUser:", currentUser);

  if (!file?.isPublic && !currentUser?.accountId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    // Fetch the file from Appwrite

    let url = "";

    if (download) {
      url = constructDownloadUrl(fileId);
    } else {
      url = constructFileUrl(fileId);
    }

    const response = await fetch(url);

    console.log("🚀 ~ GET ~ response:", response);

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
