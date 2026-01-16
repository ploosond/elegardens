"use client";

import { useState, useEffect, useRef } from "react";

interface HomeVideoProps {
  videoUrl: string;
  videoTitle: string;
  posterUrl?: string;
}

export default function HomeVideo({
  videoUrl,
  videoTitle,
  posterUrl,
}: HomeVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Preload video metadata immediately
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div className="absolute inset-0 -z-10">
      {/* Poster/Thumbnail background - shows immediately */}
      {posterUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
            canPlay ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Subtle loading gradient overlay - only shows if no poster */}
      {isLoading && !posterUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10" />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          canPlay ? "opacity-100" : "opacity-0"
        }`}
        src={videoUrl}
        title={videoTitle}
        aria-label={videoTitle}
        poster={posterUrl}
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={() => {
          // Video metadata loaded - can start showing
          setIsLoading(false);
        }}
        onCanPlay={() => {
          // Video can start playing - smooth transition
          setCanPlay(true);
          setIsLoading(false);
        }}
        onLoadedData={() => {
          // Fallback - ensure loading state is cleared
          setIsLoading(false);
          if (!canPlay) setCanPlay(true);
        }}
        onError={() => {
          setIsLoading(false);
          console.error("Video failed to load");
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
