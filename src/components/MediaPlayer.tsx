"use client";

import dynamic from "next/dynamic";
import "plyr/dist/plyr.css";
import { useRef, useState } from "react";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

// type === "video"
// ? {
//     // Simulating different quality options for single file (without actual quality change)
//     default: 720, // Default option
//     options: [144, 240, 360, 480, 720, 1080, 1440, 2160], // Simulate options
//     forced: true,
//     onChange(quality) {
//       console.log("🚀 ~ onChange ~ quality:", quality);
//       setUrl(`${src}?quality=${quality}`);
//     },
//   }
// : {
//     default: 720,
//     options: [720],
//     forced: false,
//   },

const MediaPlayer = ({ src, type }: MediaPlayerProps) => {
  return (
    <div>
      <Plyr
        source={{ type, sources: [{ src }] }}
        options={{
          clickToPlay: true,
          controls: [
            "play-large",
            "restart",
            "rewind",
            "play",
            "fast-forward",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "download",
            "fullscreen",
            "speed",
            "loop",
            "source",
            "quality",
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
