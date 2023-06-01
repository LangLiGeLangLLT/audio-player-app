'use client'

import AudioPlayer from '@/components/AudioPlayer'

function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <AudioPlayer src="/audio_player/musics/流星P (minato) _ 初音未来 (初音ミク) - 胧月 (朦胧月色).ogg" />
    </div>
  )
}

export default Error
