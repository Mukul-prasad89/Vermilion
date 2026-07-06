import React from 'react';

const FinalCTA = () => (
  <section className="py-32 md:py-40 text-center relative overflow-hidden bg-bg-main" id="emergency">
    <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(230, 57, 70, 0.1), transparent 60%)'}}></div>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
      <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-vermillion mb-8 py-1.5 px-3.5 border border-vermillion/30 rounded-full bg-vermillion/5">
        <span className="w-1.5 h-1.5 bg-vermillion rounded-full animate-pulse-dot" style={{boxShadow: '0 0 8px #E63946'}}></span>
        Join the network
      </div>
      <h2 className="font-display font-extralight text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-6">
        Be the <em className="italic bg-gradient-to-br from-vermillion-bright to-oxblood bg-clip-text text-transparent">reason</em><br/>someone makes it.
      </h2>
      <p className="text-lg text-fg-dim max-w-xl mx-auto mb-12 leading-relaxed">
        Whether you need blood right now, or you're ready to give it — Vermilion routes your request to the people who can act. Sign up takes 90 seconds. Average response, the same.
      </p>
      <div className="flex gap-5 justify-center flex-wrap">
        <a href="#" className="btn-magnetic group inline-flex items-center gap-2 bg-vermillion text-white px-7 py-4 text-base font-medium border border-vermillion hover:bg-vermillion-bright hover:border-vermillion-bright transition-colors shadow-lg shadow-vermillion/20">
          <i className="fa-solid fa-triangle-exclamation"></i> Request blood now
        </a>
        <a href="#" className="btn-magnetic inline-flex items-center gap-2 bg-white text-fg px-7 py-4 text-base font-medium border border-line-strong hover:border-fg transition-colors shadow-sm">
          Become a donor <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
        </a>
      </div>
    </div>
  </section>
);

export default FinalCTA;
