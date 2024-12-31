"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const MediaPlayer = ({ src, type }: MediaPlayerProps) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef?.current) {
      const player = new Plyr(playerRef.current, {
        ratio: "16:9",

        quality: {
          default: 720,
          options: [144, 240, 360, 720, 1080, 1440],
          forced: true,
        },
      });

      return () => {
        player.destroy();
      };
    }
  }, []);

  return (
    <div>
      {type === "video" ? (
        <video ref={playerRef} controls>
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <audio ref={playerRef} controls>
          <source src={src} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default MediaPlayer;
