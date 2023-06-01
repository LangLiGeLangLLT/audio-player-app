import AudioPlayer from '@/components/AudioPlayer'
import AudioPlayerV2 from '@/components/AudioPlayerV2'

export default function Home() {
  return (
    <>
      <main className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center gap-8 bg-gray-100">
        <AudioPlayer src="/audio_player/musics/流星P (minato) _ 初音未来 (初音ミク) - 胧月 (朦胧月色).ogg" />
      </main>
      {/* <main className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center gap-8 bg-purple-100">
        <AudioPlayerV2 src="/audio_player/musics/流星P (minato) _ 初音未来 (初音ミク) - 胧月 (朦胧月色).ogg" />
      </main> */}
    </>
  )
}
