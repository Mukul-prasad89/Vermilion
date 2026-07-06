import React, { useState } from 'react';
import { bloodTypes, compatibility } from '../data.js';

const Compatibility = () => {
  const [selected, setSelected] = useState('O−');
  const size = 600;
  const cx = size / 2, cy = size / 2;
  const radius = 220;

  const positions = bloodTypes.map((type, i) => {
    const angle = (i / bloodTypes.length) * Math.PI * 2 - Math.PI / 2;
    return { type, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle };
  });

  const data = compatibility[selected];
  const donatesCount = data.donatesTo.length;
  const receivesCount = data.receivesFrom.length;

  return (
    <section className="py-24 md:py-32 bg-bg-main" id="compat">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="flex justify-between items-end mb-20 gap-12 flex-wrap">
          <div className="max-w-[700px]">
            <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-vermillion"></span> Compatibility matrix
            </div>
            <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
              Know the <em className="italic text-vermillion font-normal">flow.</em>
            </h2>
          </div>
          <p className="text-base text-fg-dim max-w-sm leading-relaxed">
            Hover any blood type to reveal who it can donate to and receive from. Vermilion's matching engine uses this graph to optimize every request.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-20 items-center">
          <div>
            <h3 className="font-display font-light text-3xl md:text-4xl leading-tight mb-6 tracking-tight">
              The universal <em className="italic text-vermillion">donor</em> isn't a person.<br/>It's a <em className="italic text-vermillion">network.</em>
            </h3>
            <p className="text-base text-fg-dim leading-relaxed mb-8">
              O− can reach anyone. AB+ can receive from anyone. But every type has a critical role in the chain. Our system maps these relationships in real time to route blood where it matters most — and to flag reserves that are running thin before a crisis hits.
            </p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3.5 text-sm text-fg-dim">
                <div className="w-8 h-1 bg-vermillion"></div>
                <span>Selected type <b className="text-fg font-medium">donates to</b></span>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-fg-dim">
                <div className="w-8 h-1 bg-amber"></div>
                <span>Selected type <b className="text-fg font-medium">receives from</b></span>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-fg-dim">
                <div className="w-8 h-1 bg-gradient-to-r from-vermillion to-amber"></div>
                <span>Universal compatibility</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square max-w-[600px] mx-auto w-full">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E63946" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#E63946" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r="100" fill="url(#centerGlow)" />
              <circle cx={cx} cy={cy} r="90" fill="none" stroke="rgba(33,28,25,0.05)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="140" fill="none" stroke="rgba(33,28,25,0.03)" strokeWidth="1" strokeDasharray="2 4" />
              
              <g>
                {bloodTypes.map(type => 
                  compatibility[type].donatesTo.map(target => {
                    const p1 = positions.find(p => p.type === type);
                    const p2 = positions.find(p => p.type === target);
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    const ctrlX = cx + (midX - cx) * 0.3;
                    const ctrlY = cy + (midY - cy) * 0.3;
                    const isHighlight = type === selected;
                    const isRecipient = target === selected && type !== selected;
                    const highlightClass = isHighlight ? 'opacity-90 stroke-vermillion stroke-[2.5px]' : (isRecipient ? 'opacity-90 stroke-amber stroke-[2.5px]' : 'opacity-15 stroke-vermillion stroke-[1.5px]');
                    return <path key={`${type}-${target}`} d={`M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`} fill="none" className={`transition-all duration-300 ${highlightClass}`} />;
                  })
                )}
              </g>

              {positions.map(p => (
                <g key={p.type} className="cursor-pointer transition-all duration-300" onMouseEnter={() => setSelected(p.type)} onClick={() => setSelected(p.type)}>
                  <circle cx={p.x} cy={p.y} r="32" fill={selected === p.type ? "#E63946" : "#FFFFFF"} stroke={selected === p.type ? "#E63946" : "rgba(33,28,25,0.15)"} strokeWidth="1" className="transition-all duration-300" style={selected === p.type ? {filter: 'drop-shadow(0 4px 12px rgba(230, 57, 70, 0.3))'} : {}} />
                  <text x={p.x} y={p.y} fontFamily="Fraunces" fontWeight="600" fontSize="16" fill={selected === p.type ? "#FFFFFF" : "#211C19"} textAnchor="middle" dominantBaseline="middle" style={{pointerEvents: 'none'}}>{p.type}</text>
                </g>
              ))}
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="font-display font-medium text-6xl md:text-7xl text-vermillion leading-none tracking-tighter">{selected}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted mt-1.5">{data.label}</div>
              <div className="mt-5 text-xs text-fg-dim leading-relaxed">
                Donates to <b className="text-vermillion font-medium">{donatesCount === 8 ? 'all 8 types' : `${donatesCount} type${donatesCount > 1 ? 's' : ''}`}</b><br/>
                Receives from <b className="text-vermillion font-medium">{receivesCount === 8 ? 'all 8 types' : `${receivesCount} type${receivesCount > 1 ? 's' : ''}`}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compatibility;
