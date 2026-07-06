import React from 'react';

const HowItWorks = () => (
  <section className="py-24 md:py-32 bg-bg-3" id="how">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="flex justify-between items-end mb-20 gap-12 flex-wrap">
        <div className="max-w-[700px]">
          <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-vermillion"></span> How it works
          </div>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
            Three pulses from <em className="italic text-vermillion font-normal">need</em><br/>to <em className="italic text-vermillion font-normal">needle.</em>
          </h2>
        </div>
        <p className="text-base text-fg-dim max-w-sm leading-relaxed">
          Every emergency request travels the same three-step path through the Vermilion mesh — engineered for sub-90-second first response.
        </p>
      </div>

      <div className="grid md:grid-cols-3 bg-white border-t border-b border-line shadow-sm">
        {[
          { num: '01', title: 'Broadcast', desc: 'A paramedic or hospital triggers a request with blood type, location, and urgency tier. The signal propagates across the donor mesh within milliseconds — geofenced to a tunable radius.' },
          { num: '02', title: 'Match', desc: 'Our matching engine ranks compatible donors by distance, response history, availability window, and cold-chain logistics. Verified donors receive a discreet ping — accept, decline, or proxy-route.' },
          { num: '03', title: 'Mobilize', desc: 'On acceptance, the donor is routed to the nearest collection point or hospital. Live tracking, ETA, and hospital-side preparation happen in parallel — no phone tag, no missed handoffs.' }
        ].map((step, i, arr) => (
          <div key={step.num} className={`p-10 md:p-12 border-line transition-colors hover:bg-bg-main group ${i < arr.length - 1 ? 'md:border-r' : ''} ${i > 0 ? 'border-t md:border-t-0' : ''}`}>
            <div className="font-display font-extralight text-7xl md:text-8xl text-bg-3 group-hover:text-vermillion transition-colors leading-none mb-7 tracking-tighter">
              {step.num}<sup className="text-lg text-amber font-normal">/03</sup>
            </div>
            <h3 className="font-display font-medium text-2xl md:text-3xl mb-4 tracking-tight">{step.title}</h3>
            <p className="text-sm md:text-base text-fg-dim leading-relaxed mb-6">{step.desc}</p>
            <div className="h-20 border-t border-line pt-5 flex items-center">
              <div className="w-full h-full opacity-80 flex items-center">
                {i === 0 && (
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <circle cx="30" cy="30" r="4" fill="#E63946"/>
                    <circle cx="30" cy="30" r="10" fill="none" stroke="#E63946" strokeWidth="1" opacity="0.6">
                      <animate attributeName="r" from="4" to="20" dur="1.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="80" cy="20" r="2" fill="#F4A261"/><circle cx="80" cy="40" r="2" fill="#F4A261"/>
                    <circle cx="120" cy="15" r="2" fill="#F4A261"/><circle cx="120" cy="45" r="2" fill="#F4A261"/>
                    <circle cx="160" cy="30" r="2" fill="#F4A261"/>
                    <line x1="35" y1="30" x2="78" y2="20" stroke="#C1121F" strokeWidth="0.5"/>
                    <line x1="35" y1="30" x2="78" y2="40" stroke="#C1121F" strokeWidth="0.5"/>
                    <line x1="35" y1="30" x2="118" y2="15" stroke="#C1121F" strokeWidth="0.5"/>
                    <line x1="35" y1="30" x2="118" y2="45" stroke="#C1121F" strokeWidth="0.5"/>
                    <line x1="35" y1="30" x2="158" y2="30" stroke="#C1121F" strokeWidth="0.5"/>
                  </svg>
                )}
                {i === 1 && (
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <rect x="20" y="20" width="40" height="20" fill="none" stroke="#E63946" strokeWidth="1"/>
                    <text x="40" y="33" fontFamily="Fraunces" fontSize="11" fill="#211C19" textAnchor="middle">A+</text>
                    <rect x="80" y="10" width="40" height="20" fill="none" stroke="#F4A261" strokeWidth="1" opacity="0.4"/>
                    <text x="100" y="23" fontFamily="Fraunces" fontSize="11" fill="#A39A93" textAnchor="middle">O−</text>
                    <rect x="80" y="35" width="40" height="20" fill="#E63946" stroke="#E63946" strokeWidth="1" opacity="0.2"/>
                    <text x="100" y="48" fontFamily="Fraunces" fontSize="11" fill="#E63946" textAnchor="middle">A+</text>
                    <rect x="140" y="20" width="40" height="20" fill="none" stroke="#F4A261" strokeWidth="1" opacity="0.4"/>
                    <text x="160" y="33" fontFamily="Fraunces" fontSize="11" fill="#A39A93" textAnchor="middle">AB+</text>
                    <line x1="60" y1="30" x2="80" y2="20" stroke="#C1121F" strokeWidth="0.5" strokeDasharray="2 2"/>
                    <line x1="60" y1="30" x2="80" y2="45" stroke="#E63946" strokeWidth="1.5"/>
                    <line x1="60" y1="30" x2="140" y2="30" stroke="#C1121F" strokeWidth="0.5" strokeDasharray="2 2"/>
                  </svg>
                )}
                {i === 2 && (
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <path d="M 20 40 Q 60 10, 100 30 T 180 20" fill="none" stroke="#E63946" strokeWidth="1.5" strokeDasharray="3 3">
                      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite"/>
                    </path>
                    <circle cx="20" cy="40" r="4" fill="#F4A261"/>
                    <circle cx="180" cy="20" r="4" fill="#E63946"/>
                    <circle cx="180" cy="20" r="8" fill="none" stroke="#E63946" strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" from="4" to="12" dur="1.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <text x="20" y="55" fontFamily="Space Grotesk" fontSize="8" fill="#A39A93">DONOR</text>
                    <text x="180" y="55" fontFamily="Space Grotesk" fontSize="8" fill="#A39A93" textAnchor="end">HOSPITAL</text>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
