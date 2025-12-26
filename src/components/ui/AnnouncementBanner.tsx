'use client'

interface AnnouncementBannerProps {
  announcements: string[]
  backgroundColor: string
  textColor: string
  fontWeight: 'semibold' | 'bold' | 'extrabold'
  showOnDesktop: boolean
  showOnMobile: boolean
  speed: 'slow' | 'medium' | 'fast'
}

const speedMap = {
  slow: '30s',
  medium: '20s',
  fast: '15s',
}

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '')
  
  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default function AnnouncementBanner({
  announcements,
  backgroundColor,
  textColor,
  fontWeight,
  showOnDesktop,
  showOnMobile,
  speed,
}: AnnouncementBannerProps) {
  // Don't render if no announcements
  if (!announcements || announcements.length === 0) return null

  // Convert background color to rgba with 95% opacity
  const transparentBackground = hexToRgba(backgroundColor, 0.95)

  // Create announcement segments with flexbox for equal spacing
  const createAnnouncementSegment = (announcements: string[]) => {
    return (
      <div className="flex items-center gap-8 md:gap-12">
        {announcements.map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </div>
    )
  }

  const announcementSegment = createAnnouncementSegment(announcements)

  // Determine visibility classes
  let visibilityClass = ''
  if (showOnDesktop && showOnMobile) {
    visibilityClass = 'block'
  } else if (showOnDesktop) {
    visibilityClass = 'hidden md:block'
  } else if (showOnMobile) {
    visibilityClass = 'block md:hidden'
  } else {
    return null // Don't show if both are disabled
  }

  const fontWeightClass =
    fontWeight === 'extrabold'
      ? 'font-extrabold'
      : fontWeight === 'semibold'
      ? 'font-semibold'
      : 'font-bold'
  const animationDuration = speedMap[speed]

  return (
    <>
      <div
        className={`absolute top-0 left-0 right-0 z-20 ${visibilityClass} overflow-hidden`}
        style={{ backgroundColor: transparentBackground }}
        role="banner"
        aria-label="Announcement banner"
      >
        <div className="relative flex h-12 items-center">
          {/* Scrolling text container */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex whitespace-nowrap"
              style={{
                animation: `scroll-right-to-left ${animationDuration} linear infinite`,
              }}
            >
              {/* Repeat the segment 3 times for seamless loop */}
              {Array(3)
                .fill(0)
                .map((_, loopIndex) => (
                  <div
                    key={loopIndex}
                    className={`inline-flex items-center px-8 text-xs md:text-sm ${fontWeightClass} font-outfit tracking-wide whitespace-nowrap`}
                    style={{ color: textColor }}
                  >
                    {announcementSegment}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
