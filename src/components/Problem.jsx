import React from 'react';

const Problem = () => (
  <section className="py-24 md:py-32 relative">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="flex justify-between items-end mb-20 gap-12 flex-wrap">
        <div className="max-w-[700px]">
          <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-vermillion"></span> The problem
          </div>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
            Blood arrives <em className="italic text-vermillion font-normal">too late</em><br/>far too often.
          </h2>
        </div>
        <p className="text-base text-fg-dim max-w-sm leading-relaxed">
          In trauma, the first 60 minutes decide survival. Yet most hospitals still rely on phone trees, fragmented registries, and worn-out cold chains.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div>
          <div className="font-display font-extralight text-[120px] md:text-[200px] lg:text-[240px] leading-[0.85] tracking-tighter bg-gradient-to-b from-vermillion-bright to-oxblood bg-clip-text text-transparent mb-6">
            1<span className="text-3xl text-amber bg-none" style={{WebkitTextFillColor: '#F4A261'}}>in 4</span>
          </div>
          <p className="font-display font-light text-2xl md:text-3xl leading-tight text-fg mb-8">
            trauma-related deaths in emergency rooms could be prevented with <em className="italic text-vermillion">faster access to compatible blood</em> — a gap measured in minutes, not hours.
          </p>
          <p className="text-xs text-muted uppercase tracking-wider border-t border-line pt-4">Source — Lancet Trauma Series · WHO Global Blood Safety Report</p>
        </div>
        <div className="relative aspect-[4/5] border border-line-strong overflow-hidden shadow-xl shadow-vermillion/10">
          <img src="https://picsum.photos/seed/emergency-room-2024/800/1000.jpg" alt="Emergency room" className="w-full h-full object-cover" style={{filter: 'grayscale(0.2) contrast(1.05)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.25), transparent 50%, rgba(33, 28, 25, 0.4))'}}></div>
          <div className="absolute bottom-8 left-8 right-8 font-display italic font-light text-lg text-white leading-snug">
            <span className="text-6xl text-vermillion-bright leading-none mr-2 align-bottom">“</span>
            I have lost patients not because the blood didn't exist — but because we couldn't find it in time. That is the gap Vermilion closes.
            <span className="block font-sans not-italic text-[11px] text-amber-soft uppercase tracking-[0.15em] mt-4">Dr. Ananya Rao · Head of Trauma, Aster Hospital</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Problem;
