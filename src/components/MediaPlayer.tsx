"use client";

import dynamic from "next/dynamic";
import "plyr/dist/plyr.css";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

const MediaPlayer = ({ src, type }: MediaPlayerProps) => {
  return (
    <div>
      <Plyr
        source={{ type, sources: [{ src }] }}
        poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
        options={{
          previewThumbnails: {
            enabled: true,
            src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.jpg",
          },

          quality: {
            default: -1,
            options: [-1, 144, 240, 360, 480, 720, 1080],
            forced: true,
            onChange(quality) {
              console.log("🚀 ~ onChange ~ quality:", quality);
            },
          },
          controls: [
            "play-large", // The large play button in the center
            "restart", // Restart playback
            "rewind", // Rewind by the seek time (default 10 seconds)
            "play", // Play/pause playback
            "fast-forward", // Fast forward by the seek time (default 10 seconds)
            "progress", // The progress bar and scrubber for playback and buffering
            "current-time", // The current time of playback
            "duration", // The full duration of the media
            "mute", // Toggle mute
            "volume", // Volume control
            "captions", // Toggle captions
            "settings", // Settings menu
            "pip", // Picture-in-picture (currently Safari only)
            "airplay", // Airplay (currently Safari only)
            "download",
            "fullscreen", // Toggle fullscreen
            "quality",
            "speed",
            "loop",
            "source",
            "pip",
          ],
          keyboard: {
            focused: true,
            global: true,
          },
        }}
      />
    </div>
  );
};

export default MediaPlayer;
