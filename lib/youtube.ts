/** Extract 11-character YouTube video id from common URL shapes. */
export function youtubeVideoIdFromUrl(raw: string): string | null {
  const s = raw.trim()
  if (!s) return null
  try {
    const u = new URL(s)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id && /^[\w-]{11}$/.test(id) ? id : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v && /^[\w-]{11}$/.test(v)) return v
      const m = u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)
      if (m?.[1]) return m[1]
    }
    return null
  } catch {
    return null
  }
}

export function youtubeThumbnailUrl(videoId: string, quality: 'hq' | 'max' = 'hq'): string {
  return quality === 'max'
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function youtubeEmbedUrl(videoId: string, autoplay = true): string {
  const q = autoplay ? '?autoplay=1' : ''
  return `https://www.youtube-nocookie.com/embed/${videoId}${q}`
}
