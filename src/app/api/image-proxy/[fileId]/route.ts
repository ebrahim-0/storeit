import { getFileByBucketFileId } from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { constructDownloadUrl, constructFileUrl } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  const { fileId } = params;

  const { searchParams } = new URL(request.url);

  const download = searchParams.get("download");

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  const file = await getFileByBucketFileId(fileId);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { error, ...currentUser } = await getCurrentUser();

  try {
    if (
      file?.isPublic ||
      currentUser?.accountId === file?.accountId ||
      file?.users.includes(currentUser?.email)
    ) {
      let url = "";

      if (!!download) {
        url = constructDownloadUrl(fileId);
      } else {
        url = constructFileUrl(fileId);
      }

      const response = await fetch(url);

      const contentType =
        response.headers.get("Content-Type") || "application/octet-stream";
      const fileStream = response.body;

      return new Response(fileStream, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        },
      });
    } else {
      return NextResponse.json(
        { error: "You are not authorized to view this file" },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error("Error proxying the image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
