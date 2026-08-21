"use client";

import { type KeyboardEvent, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type LandingMediaSlotProps = {
  videoSrc?: string;
  webmSrc?: string;
  posterSrc?: string;
};

type LandingVideoProps = Required<Pick<LandingMediaSlotProps, "videoSrc">> &
  Pick<LandingMediaSlotProps, "webmSrc" | "posterSrc">;

function LandingVideo({ videoSrc, webmSrc, posterSrc }: LandingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => {
        // Playback can still be blocked by the browser.
      });
    } else {
      video.pause();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLVideoElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    togglePlayback();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // Autoplay can still be blocked by the browser; the media fallback remains visible.
    });
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      className="landing-v14-media"
      poster={posterSrc}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      controls={false}
      preload="metadata"
      role="button"
      tabIndex={0}
      aria-label="Mettre la vidéo en pause ou reprendre la lecture"
      onClick={togglePlayback}
      onKeyDown={handleKeyDown}
    >
      {webmSrc && <source src={webmSrc} type="video/webm" />}
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

export function LandingMediaSlot({ videoSrc, webmSrc, posterSrc }: LandingMediaSlotProps) {
  return (
    <div className="landing-v14-media-slot">
      {videoSrc ? (
        <LandingVideo
          key={`${webmSrc ?? ""}:${videoSrc}`}
          videoSrc={videoSrc}
          webmSrc={webmSrc}
          posterSrc={posterSrc}
        />
      ) : (
        <div className="landing-v14-media-empty" aria-hidden="true" />
      )}
    </div>
  );
}
