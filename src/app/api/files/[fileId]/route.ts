// import { getFileByBucketFileId } from "@/lib/actions/file.action";
// import { getCurrentUser } from "@/lib/actions/user.action";
// import {
//   constructDownloadUrl,
//   constructFileUrl,
//   getContentType,
// } from "@/lib/utils";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ fileId: string }> },
// ) {
//   const { fileId } = await params;

//   const { searchParams } = new URL(request.url);

//   const download = searchParams.get("download");

//   if (!fileId) {
//     return NextResponse.json({ error: "File ID is required" }, { status: 400 });
//   }

//   const file = await getFileByBucketFileId(fileId);

//   if (!file) {
//     return NextResponse.json({ error: "File not found" }, { status: 404 });
//   }

//   const { error, ...currentUser } = await getCurrentUser();

//   try {
//     if (
//       file?.isPublic ||
//       currentUser?.accountId === file?.accountId ||
//       file?.users.includes(currentUser?.email)
//     ) {
//       let url = "";

//       if (!!download) {
//         url = constructDownloadUrl(fileId);
//       } else {
//         url = constructFileUrl(fileId);
//       }

//       const response = await fetch(url);

//       // Determine the Content-Type based on the file extension
//       let contentType = getContentType(file?.extension); // Default content type

//       // Handle cache validation with ETag
//       const ifNoneMatch = request.headers.get("If-None-Match");
//       const etag = `"${fileId}"`; // Generate ETag from fileId (or use a hash of the file content)

//       if (ifNoneMatch === etag) {
//         return new Response(null, {
//           status: 304, // Not Modified
//           headers: {
//             ETag: etag,
//           },
//         });
//       }

//       // Handle range requests for media files (e.g., video/audio streaming)
//       const range = request.headers.get("range");
//       if (
//         range &&
//         (contentType.startsWith("video/") || contentType.startsWith("audio/"))
//       ) {
//         const fileSize = response.headers.get("content-length");
//         if (fileSize) {
//           const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
//           const start = parseInt(startStr, 10);
//           const end = endStr
//             ? parseInt(endStr, 10)
//             : parseInt(fileSize, 10) - 1;

//           if (!isNaN(start) && !isNaN(end)) {
//             const chunkSize = end - start + 1;
//             const headers = {
//               "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//               "Accept-Ranges": "bytes",
//               "Content-Length": chunkSize.toString(),
//               "Content-Type": contentType,
//               "Cache-Control": "public, max-age=3600", // Cache for 1 hour for partial content
//               ETag: etag, // Use ETag for cache validation
//             };

//             const partialResponse = await fetch(url, {
//               headers: { Range: `bytes=${start}-${end}` },
//             });

//             return new Response(partialResponse.body, {
//               status: 206, // Partial Content
//               headers,
//             });
//           }
//         }
//       }

//       // For non-range requests or non-media files
//       return new Response(response.body, {
//         headers: {
//           "Content-Type": contentType,
//           "Cache-Control": "public, max-age=3600", // Cache for 1 hour for partial content
//           ETag: etag, // Use ETag for cache validation
//         },
//       });
//     } else {
//       return NextResponse.json(
//         { error: "You are not authorized to view this file" },
//         { status: 403 },
//       );
//     }
//   } catch (error) {
//     console.error("Error proxying the file:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { getFileByBucketFileId } from "@/lib/actions/file.action";
// import { getCurrentUser } from "@/lib/actions/user.action";
// import { constructFileUrl } from "@/lib/utils";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ fileId: string }> },
// ) {
//   const { fileId } = await params;

//   if (!fileId) {
//     return NextResponse.json({ error: "File ID is required" }, { status: 400 });
//   }

//   const file = await getFileByBucketFileId(fileId);
//   if (!file) {
//     return NextResponse.json({ error: "File not found" }, { status: 404 });
//   }

//   const { error, ...currentUser } = await getCurrentUser();

//   try {
//     if (
//       file?.isPublic ||
//       currentUser?.accountId === file?.accountId ||
//       file?.users.includes(currentUser?.email)
//     ) {
//       const fileUrl = constructFileUrl(fileId); // URL to the remote file

//       // Fetch the remote file
//       const response = await fetch(fileUrl);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch file: ${response.statusText}`);
//       }

//       const fileSize = file.size;

//       const range = request.headers.get("range");

//       if (range) {
//         // Extract the start and end bytes from the range header
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//         // Ensure the end byte is within the file size
//         if (start >= fileSize || end >= fileSize) {
//           return new NextResponse("Requested range not satisfiable", {
//             status: 416,
//           });
//         }

//         // Create a ReadableStream for the requested chunk
//         const readableStream = new ReadableStream({
//           async start(controller) {
//             const reader = response.body?.getReader();
//             let offset = 0;

//             while (true) {
//               const { done, value } = await reader!.read();

//               if (done) {
//                 controller.close();
//                 break;
//               }

//               // Only send the chunk if it falls within the requested range
//               if (offset + value.length > start) {
//                 const chunkStart = Math.max(start - offset, 0);
//                 const chunkEnd = Math.min(end - offset + 1, value.length);
//                 const chunk = value.slice(chunkStart, chunkEnd);

//                 controller.enqueue(chunk);
//               }

//               offset += value.length;

//               if (offset > end) {
//                 controller.close();
//                 break;
//               }
//             }
//           },
//         });

//         // Set headers for partial content
//         const headers = {
//           "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//           "Accept-Ranges": "bytes",
//           "Content-Length": String(end - start + 1),
//           "Content-Type": "video/mp4",
//         };

//         return new NextResponse(readableStream, { status: 206, headers });
//       } else {
//         // If no range header, send the entire file
//         const headers = {
//           "Content-Length": String(fileSize),
//           "Content-Type": "video/mp4",
//         };

//         return new NextResponse(response.body, { status: 200, headers });
//       }
//     } else {
//       return NextResponse.json(
//         { error: "You are not authorized to view this file" },
//         { status: 403 },
//       );
//     }
//   } catch (error) {
//     console.error("Error streaming the file:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import {
  getFileByBucketFileId,
  getFileDownload,
} from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;

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
      const fileUrl = getFileDownload(fileId);

      const arrayBuffer = await fileUrl;
      const blob = new Blob([arrayBuffer]);

      const url = URL.createObjectURL(blob);
      return new NextResponse(url, { status: 206 });
    } else {
      return NextResponse.json(
        { error: "You are not authorized to view this file" },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error("Error streaming the file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
