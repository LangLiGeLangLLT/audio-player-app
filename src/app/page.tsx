import AudioPlayer from '@/components/AudioPlayer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center gap-2">
      <AudioPlayer src="/musics/流星P (minato) _ 初音未来 (初音ミク) - 胧月 (朦胧月色).ogg" />
    </main>
  )
}
