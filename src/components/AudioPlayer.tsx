'use client'

import {
  AudioHTMLAttributes,
  PointerEvent,
  SVGAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CiPause1, CiPlay1, CiVolume } from 'react-icons/ci'

type AudioPlayerProps = AudioHTMLAttributes<HTMLAudioElement>

function getSeconds(t: number): string {
  return `${~~(t % 60)}`.padStart(2, '0')
}

function getMinutes(t: number): string {
  return `${~~(t / 60) % 60}`.padStart(2, '0')
}

function AudioPlayer(props: AudioPlayerProps) {
  const { src } = props

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.4)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const intervalTimer = useRef<any>()

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      setCurrentTime(Math.min(currentTime, duration))
    }
  }

  const onVolumeChange = () => {
    if (audioRef.current) {
      const volume = audioRef.current.volume
      setVolume(volume)
    }
  }

  const onEnded = () => {
    setIsPlaying(false)
  }

  const onProgressClick = (event: PointerEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const { clientWidth } = progressRef.current
      const { offsetX } = event.nativeEvent
      const currentTime = (offsetX / clientWidth) * duration
      audioRef.current.currentTime = currentTime
    }
  }

  const onVolumeClick = (event: PointerEvent<HTMLDivElement>) => {
    if (audioRef.current && volumeRef.current) {
      const { clientWidth } = volumeRef.current
      const { offsetX } = event.nativeEvent
      const volume = offsetX / clientWidth
      audioRef.current.volume = volume
    }
  }

  const onBack = () => {
    if (audioRef.current) {
      const currentTime = Math.max(audioRef.current.currentTime - 15, 0)
      audioRef.current.currentTime = currentTime
    }
  }

  const onForward = () => {
    if (audioRef.current) {
      const currentTime = Math.min(audioRef.current.currentTime + 15, duration)
      audioRef.current.currentTime = currentTime
    }
  }

  useEffect(() => {
    intervalTimer.current = setInterval(() => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    }, 10)
  }, [])

  useEffect(() => {
    if (duration) {
      intervalTimer.current && clearInterval(intervalTimer.current)
    }
  }, [duration])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  return (
    <>
      <div className="flex w-[40rem] rounded-lg bg-gray shadow-xl shadow-black/5 ring-1 ring-indigo-700/10">
        <div className="flex items-center space-x-4 px-6 py-4 hover:cursor-pointer text-indigo-100">
          <Back onClick={onBack} />
          {isPlaying ? (
            <CiPause1 size={30} onClick={togglePlay} />
          ) : (
            <CiPlay1 size={30} onClick={togglePlay} />
          )}
          <Forward onClick={onForward} />
        </div>
        <div className="flex flex-auto items-center border-1 border-indigo-200/60 pl-6 pr-4 text-[0.8125rem] leading-5 text-indigo-700">
          <div>{`${getMinutes(currentTime)}:${getSeconds(currentTime)}`}</div>
          <div
            ref={progressRef}
            onClick={onProgressClick}
            className="ml-4 flex flex-auto rounded-full bg-indigo-100 hover:cursor-pointer"
          >
            <div
              className="h-2 rounded-l-full rounded-r-[1px] bg-indigo-600"
              style={{ width: `${~~((currentTime / duration) * 100)}%` }}
            ></div>
            <div className="-my-[0.3125rem] ml-0.5 h-[1.125rem] w-1 rounded-full bg-indigo-600"></div>
          </div>
          <div className="ml-4">{`${getMinutes(duration)}:${getSeconds(
            duration
          )}`}</div>
          <CiVolume className="ml-6" size={24} />
          <div
            ref={volumeRef}
            onClick={onVolumeClick}
            className="ml-4 flex w-14 rounded-full bg-indigo-100 hover:cursor-pointer"
          >
            <div
              className="h-2 rounded-l-full rounded-r-[1px] bg-indigo-600"
              style={{ width: `${~~(volume * 100)}%` }}
            ></div>
            <div className="-my-[0.3125rem] ml-0.5 h-[1.125rem] w-1 rounded-full bg-indigo-600"></div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onVolumeChange={onVolumeChange}
        onEnded={onEnded}
        onLoad={() => console.log('onLoad')}
      ></audio>
    </>
  )
}

function Back(props: SVGAttributes<SVGElement>) {
  return (
    <svg {...props} className="h-6 w-6 flex-none" fill="none">
      <path
        d="M6.22 11.03a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM3 6.75l-.53-.53a.75.75 0 0 0 0 1.06L3 6.75Zm4.28-3.22a.75.75 0 0 0-1.06-1.06l1.06 1.06ZM13.5 18a.75.75 0 0 0 0 1.5V18ZM7.28 9.97 3.53 6.22 2.47 7.28l3.75 3.75 1.06-1.06ZM3.53 7.28l3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm16.72 5.47c0 2.9-2.35 5.25-5.25 5.25v1.5a6.75 6.75 0 0 0 6.75-6.75h-1.5ZM15 7.5c2.9 0 5.25 2.35 5.25 5.25h1.5A6.75 6.75 0 0 0 15 6v1.5ZM15 6H3v1.5h12V6Zm0 12h-1.5v1.5H15V18Z"
        fill="#64748B"
      ></path>
      <path
        d="M3 15.75h.75V21"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9 16.5A.75.75 0 0 0 9 15v1.5Zm-2.25-.75V15a.75.75 0 0 0-.75.75h.75Zm0 2.25H6c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5ZM9 15H6.75v1.5H9V15Zm-3 .75V18h1.5v-2.25H6Zm.75 3h1.5v-1.5h-1.5v1.5Zm1.5 1.5h-1.5v1.5h1.5v-1.5ZM9 19.5a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25H9Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z"
        fill="#64748B"
      ></path>
    </svg>
  )
}

function Forward(props: SVGAttributes<SVGElement>) {
  return (
    <svg {...props} className="h-6 w-6 flex-none" fill="none">
      <path
        d="M16.72 9.97a.75.75 0 1 0 1.06 1.06l-1.06-1.06ZM21 6.75l.53.53a.75.75 0 0 0 0-1.06l-.53.53Zm-3.22-4.28a.75.75 0 1 0-1.06 1.06l1.06-1.06ZM10.5 19.5a.75.75 0 0 0 0-1.5v1.5Zm3.75-4.5a.75.75 0 0 0 0 1.5V15Zm.75.75h.75A.75.75 0 0 0 15 15v.75ZM14.25 21a.75.75 0 0 0 1.5 0h-1.5Zm6-4.5a.75.75 0 0 0 0-1.5v1.5ZM18 15.75V15a.75.75 0 0 0-.75.75H18ZM18 18h-.75c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5Zm-.22-9.22 3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm3.75-4.81-3.75-3.75-1.06 1.06 3.75 3.75 1.06-1.06ZM2.25 12.75A6.75 6.75 0 0 0 9 19.5V18a5.25 5.25 0 0 1-5.25-5.25h-1.5ZM9 6a6.75 6.75 0 0 0-6.75 6.75h1.5C3.75 9.85 6.1 7.5 9 7.5V6Zm0 1.5h12V6H9v1.5Zm0 12h1.5V18H9v1.5Zm5.25-3H15V15h-.75v1.5Zm0-.75V21h1.5v-5.25h-1.5Zm6-.75H18v1.5h2.25V15Zm-3 .75V18h1.5v-2.25h-1.5Zm.75 3h1.5v-1.5H18v1.5Zm1.5 1.5H18v1.5h1.5v-1.5Zm.75-.75a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25h-1.5Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z"
        fill="#64748B"
      ></path>
    </svg>
  )
}

export default AudioPlayer
