'use client'

interface HomeVideoProps {
  videoUrl: string
  videoTitle: string
}

export default function HomeVideo({ videoUrl, videoTitle }: HomeVideoProps) {
  if (!videoUrl) return null

  return (
    <div className="absolute inset-0 -z-10">
      <video
        className="h-full w-full object-cover"
        src={videoUrl}
        title={videoTitle}
        aria-label={videoTitle}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}

