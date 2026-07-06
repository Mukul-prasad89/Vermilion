import React from 'react';

const Timeline = () => (
  <section className="py-24 md:py-32 bg-bg-main border-t border-b border-line">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="flex justify-between items-end mb-20 gap-12 flex-wrap">
        <div className="max-w-[700px]">
          <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-vermillion"></span> Anatomy of a request
          </div>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
            From alert to <em className="italic text-vermillion font-normal">arm</em><br/>in under <em className="italic text-vermillion font-normal">5 minutes.</em>
          </h2>
        </div>
        <p className="text-base text-fg-dim max-w-sm leading-relaxed">
          A typical Vermilion-mobilized transfusion — reconstructed from real request logs (anonymized, Bengaluru, Oct 2024).
        </p>
      </div>

      <div className="relative py-10 my-20 mx-10 md:mx-20">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-line -translate-y-1/2 rounded-full">
          <div className="h-full bg-gradient-to-r from-vermillion to-amber origin-left animate-fill-track w-full rounded-full"></div>
        </div>
        {[
          { pos: '0%', time: '0s', event: 'Alert raised', desc: 'Paramedic triggers B+ request' },
          { pos: '22%', time: '12s', event: 'Mesh responds', desc: '14 compatible donors pinged' },
          { pos: '45%', time: '38s', event: 'Donor en route', desc: '1.2km — ETA 4 min' },
          { pos: '70%', time: '84s', event: 'First match', desc: '2nd donor confirmed as backup' },
          { pos: '100%', time: '4m', event: 'Transfusion begins', desc: 'Patient stabilizes at 6m' }
        ].map((p, i) => (
          <div key={i} className="absolute top-1/2 -translate-y-1/2 text-center w-32 md:w-45" style={{left: p.pos, transform: 'translate(-50%, -50%)'}}>
            <div className="relative w-4 h-4 bg-bg-main border-2 border-vermillion rounded-full mx-auto mb-4">
              <div className="absolute inset-[-6px] border border-vermillion rounded-full opacity-0 animate-ring-pulse"></div>
            </div>
            <div className="font-display font-medium text-xl md:text-2xl text-vermillion mb-1.5 tracking-tight">{p.time}</div>
            <div className="text-xs text-fg-dim leading-tight">
              <b className="text-fg block font-medium mb-1">{p.event}</b>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Timeline;
