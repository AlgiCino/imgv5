import { proxify } from '@/lib/format';
import LazyVideo from '@/components/ui/LazyVideo';

export default function VideoBlock({ src, poster }: { src: string; poster?: string }) {
  const v = proxify(src);
  const p = poster ? proxify(poster) : undefined;
  
  return (
    <div className="rounded-xl overflow-hidden border border-gold/30 shadow-xl bg-black">
      <LazyVideo
        src={v}
        poster={p}
        controls={true}
        className="w-full h-full"
        height="400px"
        alt="Project video"
      />
    </div>
  );
}