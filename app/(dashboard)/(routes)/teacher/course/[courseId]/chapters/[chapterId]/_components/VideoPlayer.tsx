"use client";
import React, { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

import { CreateToken } from "./CreateToken";

const VideoPlayer = ({ playbackId }: { playbackId: string }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenValue = await CreateToken(playbackId);
        setToken(tokenValue);
      } catch (error) {
        console.error("Error Creating TOken token:", error);
      }
    };

    fetchToken();
  }, [playbackId]);

  return (
    <div>
      {token && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={playbackId}
          tokens={{ playback: token }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
