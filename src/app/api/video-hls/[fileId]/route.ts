import { constructFileUrl } from "@/lib/utils";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { searchParams } = new URL(request.url);
  const { fileId } = await params;
  const quality =
    (searchParams.get("quality") as keyof typeof qualities) || "480";

  const src = constructFileUrl(fileId);

  // Define available qualities and corresponding settings
  const qualities: { [key: string]: { resolution: string; bitrate: string } } =
    {
      "2160": { resolution: "3840x2160", bitrate: "8000k" },
      "1440": { resolution: "2560x1440", bitrate: "6000k" },
      "1080": { resolution: "1920x1080", bitrate: "3000k" },
      "720": { resolution: "1280x720", bitrate: "1500k" },
      "480": { resolution: "854x480", bitrate: "1000k" },
      "360": { resolution: "640x360", bitrate: "500k" },
      "240": { resolution: "426x240", bitrate: "300k" },
      "144": { resolution: "256x144", bitrate: "200k" },
    };

  // Validate input parameters
  if (!fileId || !quality || !qualities[quality]) {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
    });
  }

  const { resolution, bitrate } = qualities[quality];

  try {
    // Create a temporary file for the transcoded video
    const tempFilePath = path.join("/tmp", `${fileId}_${quality}.mp4`);

    // Transcode the video using ffmpeg without setting duration (process entire video)
    await new Promise((resolve, reject) => {
      ffmpeg(src)
        .outputFormat("mp4")
        .videoCodec("libx264")
        .size(resolution)
        .videoBitrate(bitrate)
        .on("start", (commandLine) => {
          console.log("🚀 ~ .on ~ commandLine:", commandLine);
          console.log("FFmpeg command:", commandLine);
        })
        .on("end", () => {
          console.log("Video transcoding finished");
          resolve(true);
        })
        .on("error", (err) => {
          console.error("Error transcoding video:", err);
          reject(err);
        })
        .save(tempFilePath);
    });

    // Check if the transcoded file exists before streaming
    if (!fs.existsSync(tempFilePath)) {
      throw new Error("Transcoded video file does not exist.");
    }

    // Log the file size
    const fileStats = fs.statSync(tempFilePath);
    console.log(`Transcoded file size: ${fileStats.size} bytes`);

    // Read the transcoded video file and send it in the response
    const videoStream = fs.createReadStream(tempFilePath);
    videoStream.on("open", () => {
      console.log("Streaming video...");
    });

    const readableStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => {
          console.log("Video streaming finished");
          controller.close();
        });
        videoStream.on("error", (err) => {
          console.error("Error during video streaming:", err);
          controller.error(err);
        });
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
        "Content-Length": fileStats.size.toString(), // Add content length header
      },
    });
  } catch (error) {
    console.error("Error streaming video:", error);
    return new Response(JSON.stringify({ error: "Error processing video" }), {
      status: 500,
    });
  }
}
