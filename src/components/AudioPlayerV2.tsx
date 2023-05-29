import { Slider } from '@/mui'
import { AudioHTMLAttributes } from 'react'

type AudioPlayerProps = AudioHTMLAttributes<HTMLAudioElement>

function AudioPlayerV2(props: AudioPlayerProps) {
  const { src } = props

  return (
    <div className="w-96">
      <Slider defaultValue={50} />
    </div>
  )
}

export default AudioPlayerV2
