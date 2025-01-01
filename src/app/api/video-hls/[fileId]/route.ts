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

  const qualities = {
    "2160": { resolution: "3840x2160", bitrate: "8000k" },
    "1440": { resolution: "2560x1440", bitrate: "6000k" },
    "1080": { resolution: "1920x1080", bitrate: "3000k" },
    "720": { resolution: "1280x720", bitrate: "1500k" },
    "480": { resolution: "854x480", bitrate: "1000k" },
    "360": { resolution: "640x360", bitrate: "500k" },
    "240": { resolution: "426x240", bitrate: "300k" },
    "144": { resolution: "256x144", bitrate: "200k" },
  };

  if (!fileId || !quality || !qualities[quality]) {
    console.error("Invalid parameters:", { fileId, quality });
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
    });
  }

  const { resolution, bitrate } = qualities[quality];

  try {
    const tempFilePath = path.join("/tmp", `${fileId}_${quality}.mp4`);

    console.log("Transcoding video from:", src);
    console.log("Target resolution:", resolution);
    console.log("Target bitrate:", bitrate);

    await new Promise((resolve, reject) => {
      ffmpeg(src)
        .outputOptions(["-preset veryfast", "-movflags +faststart"])
        .outputFormat("mp4")
        .videoCodec("libx264")
        .size(resolution)
        .videoBitrate(bitrate)
        .on("start", (commandLine) => {
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

    if (!fs.existsSync(tempFilePath)) {
      console.error("Transcoded file does not exist.");
      throw new Error("Transcoded video file does not exist.");
    }

    const fileStats = fs.statSync(tempFilePath);
    console.log(`Transcoded file size: ${fileStats.size} bytes`);

    const videoStream = fs.createReadStream(tempFilePath);

    const readableStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => controller.close());
        videoStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        videoStream.destroy();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
        "Content-Length": fileStats.size.toString(),
      },
    });
  } catch (error) {
    console.error("Error processing video:", error);
    return new Response(JSON.stringify({ error: "Error processing video" }), {
      status: 500,
    });
  }
}
