'use client'

import { Button, Slider, Typography } from '@material-tailwind/react'
import {
  AudioHTMLAttributes,
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type AudioPlayerProps = AudioHTMLAttributes<HTMLAudioElement>

function getSeconds(t: number): string {
  return `${~~(t % 60)}`.padStart(2, '0')
}

function getMinutes(t: number): string {
  return `${~~(t / 60) % 60}`.padStart(2, '0')
}

function AudioPlayerV2(props: AudioPlayerProps) {
  const { src } = props

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  const scale = useMemo(() => (duration ? duration / 100 : 1), [duration])

  const audio = useRef<HTMLAudioElement>(null)
  const audioCtx = useRef<AudioContext>()
  const track = useRef<MediaElementAudioSourceNode>()

  const onPlay = async () => {
    if (!audio.current || !audioCtx.current) return

    if (audioCtx.current.state === 'suspended') {
      await audioCtx.current.resume()
      audio.current.currentTime = currentTime
    }
    setIsPlaying(!isPlaying)
  }

  const onProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!audio.current) return

    const progress = e.target.valueAsNumber
    const currentTime = progress * scale
    audio.current.currentTime = currentTime
    setProgress(progress)
  }

  const onTimeUpdate = () => {
    if (!audio.current) return

    const { currentTime } = audio.current
    const progress = currentTime / scale
    setProgress(progress)
  }

  useEffect(() => {
    if (isPlaying) {
      audio.current?.play()
    } else {
      audio.current?.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    setCurrentTime(progress * scale)
  }, [progress, scale])

  useEffect(() => {
    if (!audio.current) return

    audioCtx.current = audioCtx.current || new AudioContext()

    track.current =
      track.current || audioCtx.current.createMediaElementSource(audio.current)

    track.current.connect(audioCtx.current.destination)

    setDuration(audio.current.duration)
  }, [progress, scale])

  return (
    <div>
      <div className="flex items-center gap-4">
        <Button className="w-full" onClick={onPlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Typography className="font-normal">
          {`${getMinutes(currentTime)}:${getSeconds(currentTime)}`}
        </Typography>
        <Slider value={`${progress}`} onChange={onProgressChange} />
        <Typography className="font-normal">
          {`${getMinutes(duration)}:${getSeconds(duration)}`}
        </Typography>
        <Slider defaultValue={50} />
      </div>
      <audio ref={audio} src={src} onTimeUpdate={onTimeUpdate} />
    </div>
  )
}

export default AudioPlayerV2

export { Button, Slider, Typography }
