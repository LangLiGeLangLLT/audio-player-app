'use client'

import {
  AudioHTMLAttributes,
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type AudioPlayerProps = AudioHTMLAttributes<HTMLAudioElement>

function getSecs(t: number): string {
  return `${parseInt(`${t % 60}`, 10)}`.padStart(2, '0')
}

function getMins(t: number): string {
  return `${parseInt(`${(t / 60) % 60}`, 10)}`.padStart(2, '0')
}

function AudioPlayer(props: AudioPlayerProps) {
  const { src } = props
  const [show, setShow] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const [audioCtx, setAudioCtx] = useState<AudioContext>()
  const [track, setTrack] = useState<MediaElementAudioSourceNode>()
  const [gainNode, setGainNode] = useState<GainNode>()
  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode>()
  const [bufferLength, setBufferLength] = useState<number>()
  const [dataArray, setDataArray] = useState<Uint8Array>()
  const [volume, setVolume] = useState<number>(0.4)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [processMax, setProcessMax] = useState(0)
  const [animationId, setAnimationId] = useState<number>()

  function seekTo(event: ChangeEvent<HTMLInputElement>) {
    if (audio.current) {
      audio.current.currentTime = +event.target.value
    }
  }

  function changeVolume(event: ChangeEvent<HTMLInputElement>) {
    const volume = +event.target.value
    setVolume(volume)
    setGainNode((gainNode) => {
      if (!gainNode) return
      gainNode.gain.value = volume
      return gainNode
    })
  }

  function onLoadedMetadata() {
    if (audio.current) {
      const { duration } = audio.current
      setDuration(duration)
      setProcessMax(duration)
    }
  }

  function onTimeUpdate() {
    if (audio.current) {
      const { currentTime } = audio.current
      setCurrentTime(currentTime)
    }
  }

  function onEnded() {
    setPlaying(false)
  }

  function initializeAudio() {
    if (audio.current) {
      const audioCtx = new AudioContext()
      const track = audioCtx.createMediaElementSource(audio.current)
      const gainNode = audioCtx.createGain()
      const analyzerNode = audioCtx.createAnalyser()
      const bufferLength = analyzerNode.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      analyzerNode.fftSize = 2048
      analyzerNode.getByteFrequencyData(dataArray)

      track.connect(gainNode).connect(audioCtx.destination)

      setAudioCtx(audioCtx)
      setTrack(track)
      setGainNode(gainNode)
      setAnalyzerNode(analyzerNode)
      setBufferLength(bufferLength)
      setDataArray(dataArray)
    }
  }

  function updateFrequency() {
    console.log('updateFrequency')
    setAnimationId(requestAnimationFrame(updateFrequency))
  }

  async function togglePlay() {
    if (audioCtx?.state === 'suspended') {
      await audioCtx.resume()
    }
    if (audio.current) {
      if (playing) {
        audio.current.pause()
        setPlaying(false)
        animationId && cancelAnimationFrame(animationId)
      } else {
        await audio.current.play()
        setPlaying(true)
        updateFrequency()
      }
    }
  }

  useEffect(() => {
    setShow(true)
  }, [])

  useEffect(() => {
    if (show && src) {
      initializeAudio()
    }
  }, [show, src])

  return (
    <>
      {show && (
        <div>
          <audio
            className="hidden"
            src={src}
            ref={audio}
            controls
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
          />
          <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
          <canvas />
          <div>
            <span>{`${getMins(currentTime)}:${getSecs(currentTime)}`}</span>
            <input
              type="range"
              max={processMax}
              value={currentTime}
              onChange={seekTo}
            />
            <span>{`${getMins(duration)}:${getSecs(duration)}`}</span>
            <canvas></canvas>
          </div>
          <div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={volume}
              onChange={changeVolume}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AudioPlayer
