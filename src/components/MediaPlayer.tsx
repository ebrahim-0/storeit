"use client";

import dynamic from "next/dynamic";
import "plyr/dist/plyr.css";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

const MediaPlayer = ({ src, type }: MediaPlayerProps) => {
  return (
    <div>
      <Plyr
        source={{ type, sources: [{ src }] }}
        options={{
          clickToPlay: true,
          disableContextMenu: false,
          hideControls: true,
          captions: { active: true, update: true, language: "auto" },
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
