type LandingMediaSlotProps = {
  videoSrc?: string;
  posterSrc?: string;
};

export function LandingMediaSlot({ videoSrc, posterSrc }: LandingMediaSlotProps) {
  return (
    <div className="landing-v14-media-slot">
      {videoSrc ? (
        <video
          className="landing-v14-media"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div className="landing-v14-media-empty" aria-hidden="true" />
      )}
    </div>
  );
}
