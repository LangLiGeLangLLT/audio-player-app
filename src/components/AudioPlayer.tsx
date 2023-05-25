'use client'

import {
  AudioHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type AudioPlayerProps = AudioHTMLAttributes<HTMLAudioElement>

function getSecs(t: number): string {
  const res = parseInt(`${t % 60}`, 10)
  return res < 10 ? `0${res}` : `${res}`
}

function getMins(t: number): string {
  const res = parseInt(`${(t / 60) % 60}`, 10)
  return res < 10 ? `0${res}` : `${res}`
}

function AudioPlayer(props: AudioPlayerProps) {
  const { src } = props
  const audio = useRef<HTMLAudioElement>(null)
  const [show, setShow] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext>()
  const [track, setTrack] = useState<MediaElementAudioSourceNode>()
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [processMax, setProcessMax] = useState(0)
  const durationSecs = useMemo(() => getSecs(duration), [duration])
  const durationMins = useMemo(() => getMins(duration), [duration])
  const currentTimeSecs = useMemo(() => getSecs(currentTime), [currentTime])
  const currentTimeMins = useMemo(() => getMins(currentTime), [currentTime])

  const togglePlay = useCallback(async () => {
    if (audioContext?.state === 'suspended') {
      await audioContext.resume()
    }
    if (audio.current) {
      if (playing) {
        audio.current.pause()
        setPlaying(false)
      } else {
        await audio.current.play()
        setPlaying(true)
      }
    }
  }, [audioContext, playing])

  const handleLoadedMetaData = useCallback(() => {
    if (audio.current) {
      const { duration } = audio.current
      setDuration(duration)
      setProcessMax(duration)
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (audio.current) {
      const { currentTime } = audio.current
      setCurrentTime(currentTime)
    }
  }, [])

  useEffect(() => {
    setShow(true)
    setAudioContext(new AudioContext())
  }, [])

  useEffect(() => {
    setTrack((prevTrack) => {
      if (!audioContext || !audio.current) return
      if (prevTrack) return prevTrack

      const currTrack = audioContext.createMediaElementSource(audio.current)
      currTrack.connect(audioContext.destination)
      return currTrack
    })
  }, [audioContext])

  return (
    <>
      {show && (
        <div>
          <audio
            src={src}
            ref={audio}
            controls
            onLoadedMetadata={handleLoadedMetaData}
            onTimeUpdate={handleTimeUpdate}
          />
          <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
          <div>
            <span>{`${currentTimeMins}:${currentTimeSecs}`}</span>
            <input
              type="range"
              max={processMax}
              value={currentTime}
              onChange={() => {}}
            />
            <span>{`${durationMins}:${durationSecs}`}</span>
            <canvas></canvas>
          </div>
          <div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={1}
              onChange={() => {}}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AudioPlayer
