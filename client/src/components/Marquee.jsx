import React from 'react';

const Marquee = () => (
  <section className="border-t border-b border-line bg-bg-3 overflow-hidden py-5">
    <div className="flex gap-16 whitespace-nowrap animate-marquee-fast font-display text-2xl text-fg-dim font-light italic">
      {Array.from({length: 2}).map((_, i) => (
        <span key={i} className="flex gap-16 items-center">
          <span><b className="text-fg font-medium not-italic">47,284</b> donors</span>
          <span className="text-vermillion text-base">✦</span>
          <span><b className="text-fg font-medium not-italic">190</b> cities</span>
          <span className="text-vermillion text-base">✦</span>
          <span><b className="text-fg font-medium not-italic">84s</b> to first match</span>
          <span className="text-vermillion text-base">✦</span>
          <span><b className="text-fg font-medium not-italic">2.3M</b> lives touched</span>
          <span className="text-vermillion text-base">✦</span>
          <span><b className="text-fg font-medium not-italic">24/7</b> trauma response</span>
          <span className="text-vermillion text-base">✦</span>
        </span>
      ))}
    </div>
  </section>
);

export default Marquee;
