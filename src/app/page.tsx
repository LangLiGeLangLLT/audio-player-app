'use client'

import AudioPlayer from '@/components/AudioPlayer'
import AudioPlayerV2 from '@/components/AudioPlayerV2'
import { AudioHTMLAttributes, useEffect, useState } from 'react'

export default function Home() {
  const [supported, setSupported] = useState<Partial<boolean>>()

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).WebkitAudioContext
    setSupported(!!AudioContext)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center gap-8 bg-purple-100">
      <Audio
        supported={supported}
        src="/audio_player/musics/流星P (minato) _ 初音未来 (初音ミク) - 胧月 (朦胧月色).ogg"
      />
    </main>
  )
}

type AudioProps = AudioHTMLAttributes<HTMLAudioElement> &
  Partial<{ supported: boolean }>

function Audio({ supported, src }: AudioProps) {
  if (supported === undefined) return <></>

  const Component = supported ? AudioPlayerV2 : AudioPlayer
  return <Component src={src} />
}
