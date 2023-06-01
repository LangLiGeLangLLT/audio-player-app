'use client'

import {
  Button,
  IconButton,
  Slider,
  Typography,
} from '@material-tailwind/react'
import {
  AudioHTMLAttributes,
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CiPlay1,
  CiPause1,
  CiVolume,
  CiVolumeMute,
  CiVolumeHigh,
} from 'react-icons/ci'

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
  const [volume, setVolume] = useState(30)

  const scale = useMemo(() => (duration ? duration / 100 : 1), [duration])

  const audio = useRef<HTMLAudioElement>(null)
  const audioCtx = useRef<AudioContext>()
  const track = useRef<MediaElementAudioSourceNode>()
  const gainNode = useRef<GainNode>()
  const analyzerNode = useRef<AnalyserNode>()
  const bufferLength = useRef<number>()
  const dataArray = useRef<Uint8Array>()
  const canvas = useRef<HTMLCanvasElement>(null)
  const timer = useRef<number>()
  const canvasCtx = useRef<CanvasRenderingContext2D | null>()
  const bufferPercent = useRef<number>(75)
  const prevVolume = useRef<number>(0)

  useEffect(() => {
    if (isPlaying) {
      audio.current?.play()
    } else {
      audio.current?.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (isPlaying) {
      const updateFrequency = () => {
        if (
          analyzerNode.current &&
          dataArray.current &&
          canvasCtx.current &&
          canvas.current &&
          bufferLength.current
        ) {
          analyzerNode.current.getByteFrequencyData(dataArray.current)

          canvasCtx.current.clearRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height
          )
          canvasCtx.current.fillStyle = 'rgba(0, 0, 0, 0)'
          canvasCtx.current.fillRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height
          )

          const barWidth = 3
          const gap = 2
          const barCount = canvas.current.width / (barWidth + gap)
          const bufferSize =
            (bufferLength.current * bufferPercent.current) / 100

          let x = gap / 2
          for (let i = 0; i < barCount; i++) {
            const percent = Math.round((i * 100) / barCount)
            const pos = Math.round((bufferSize * percent) / 100)
            const frequency = dataArray.current[pos]
            const frequencyPercent = (frequency * 100) / 255
            const h = (frequencyPercent * canvas.current.height) / 100
            const y = canvas.current.height - h

            canvasCtx.current.fillStyle = `rgba(${dataArray.current[i]}, 100, 255, 1)`
            canvasCtx.current.fillRect(x, y, barWidth, h)

            x += barWidth + gap
          }
        }

        timer.current = requestAnimationFrame(updateFrequency)
      }
      updateFrequency()
    } else {
      timer.current && cancelAnimationFrame(timer.current)
    }
  }, [isPlaying])

  useEffect(() => {
    setCurrentTime(progress * scale)
  }, [progress, scale])

  useEffect(() => {
    if (!audio.current || !canvas.current) return

    audioCtx.current = new AudioContext()
    track.current = audioCtx.current.createMediaElementSource(audio.current)
    gainNode.current = audioCtx.current.createGain()
    analyzerNode.current = audioCtx.current.createAnalyser()

    analyzerNode.current.fftSize = 2048
    bufferLength.current = analyzerNode.current.frequencyBinCount
    dataArray.current = new Uint8Array(bufferLength.current)
    analyzerNode.current.getByteFrequencyData(dataArray.current)

    track.current
      .connect(gainNode.current)
      .connect(analyzerNode.current)
      .connect(audioCtx.current.destination)

    setDuration(audio.current.duration)

    canvasCtx.current = canvas.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume / 100
    }
  }, [volume])

  const onPlayChange = async () => {
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

  const onEnded = () => {
    setIsPlaying(false)
  }

  const onVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const volume = e.target.valueAsNumber
    setVolume(volume)
  }

  const onMuteChange = () => {
    if (volume) {
      prevVolume.current = volume
      setVolume(0)
    } else {
      setVolume(prevVolume.current)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <IconButton size="lg" color="purple" onClick={onPlayChange}>
            {isPlaying ? <CiPause1 size={24} /> : <CiPlay1 size={24} />}
          </IconButton>
          <Typography color="purple" className="font-normal">
            {`${getMinutes(currentTime)}:${getSeconds(currentTime)}`}
          </Typography>
          <Slider
            color="purple"
            className="!min-w-0 w-96"
            value={`${progress}`}
            onChange={onProgressChange}
          />
          <Typography color="purple" className="font-normal">
            {`${getMinutes(duration)}:${getSeconds(duration)}`}
          </Typography>
          <IconButton size="lg" color="purple" onClick={onMuteChange}>
            <Volume volume={volume} />
          </IconButton>
          <Slider
            color="purple"
            className="!min-w-0 w-48"
            value={`${volume}`}
            onChange={onVolumeChange}
          />
        </div>
        <canvas ref={canvas} className="w-full h-[200px]" />
      </div>

      <audio
        ref={audio}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        crossOrigin="anonymous"
      />
    </>
  )
}

function Volume({ volume }: { volume: number }) {
  if (volume === 0) {
    return <CiVolumeMute size={24} />
  }
  if (volume > 0 && volume <= 60) {
    return <CiVolume size={24} />
  }
  return <CiVolumeHigh size={24} />
}

export default AudioPlayerV2

export { Button, Slider, Typography }
