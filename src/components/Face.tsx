/* eslint-disable @next/next/no-img-element */
export type Opt = { t: string; e?: string; img?: string };

export function Face({ o }: { o: Opt }) {
  return <span className="face" aria-hidden="true">{o.img ? <img src={o.img} alt="" className="h-full w-full object-cover" /> : o.e || "🙂"}</span>;
}

export function Confetti() {
  const items = Array.from({ length: 28 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 1.2, dur: 2.2 + Math.random() * 2, e: ["🎉", "✨", "🎊", "⭐", "💛"][i % 5],
  }));
  return <>{items.map((c, i) => <span key={i} className="confetti" aria-hidden="true" style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}>{c.e}</span>)}</>;
}
