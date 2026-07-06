import React, { useState } from 'react';
import { bloodTypes, donorData } from '../data.js';

const DonorNetwork = () => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? donorData : donorData.filter(d => d.type === filter);

  return (
    <section className="py-24 md:py-32 bg-bg-3" id="network">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="flex justify-between items-end mb-12 gap-12 flex-wrap">
          <div className="max-w-[700px]">
            <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-vermillion"></span> The network · live
            </div>
            <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
              Donors near you, <em className="italic text-vermillion font-normal">now.</em>
            </h2>
          </div>
          <p className="text-base text-fg-dim max-w-sm leading-relaxed">
            Every dot on the mesh is a verified, recently-active donor. Filter by type to see real availability in your area.
          </p>
        </div>

        <div className="flex gap-2 mb-10 flex-wrap">
          {['all', ...bloodTypes].map(type => (
            <button 
              key={type} 
              onClick={() => setFilter(type)}
              className={`px-4 py-2 border text-sm transition-all rounded-full ${filter === type ? 'bg-vermillion text-white border-vermillion' : 'bg-white text-fg-dim border-line hover:text-fg hover:border-fg-dim'}`}
            >
              {type === 'all' ? 'All types' : type}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((d, i) => (
            <div key={i} className="bg-white border border-line p-6 transition-all hover:-translate-y-1 hover:border-vermillion relative overflow-hidden group shadow-sm hover:shadow-lg hover:shadow-vermillion/10">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-vermillion -translate-x-full group-hover:translate-x-0 transition-transform duration-400"></div>
              <div className="flex justify-between items-start mb-5">
                <div className="font-display font-semibold text-3xl text-vermillion leading-none tracking-tight">{d.type}</div>
                <div className={`text-[10px] uppercase tracking-wider px-2 py-1 border rounded-full ${d.status === 'available' ? 'text-green-600 border-green-600/30 bg-green-50' : 'text-amber border-amber/30 bg-amber-50'}`}>
                  {d.status === 'available' ? 'Available' : 'Limited'}
                </div>
              </div>
              <div className="text-sm text-fg font-medium mb-1">{d.name}</div>
              <div className="text-xs text-muted mb-5"><i className="fa-solid fa-location-dot text-[10px] text-vermillion mr-1"></i> {d.loc}</div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-line">
                <div>
                  <div className="font-display font-medium text-lg text-fg">{d.dist}<span className="text-[11px] text-muted"> km</span></div>
                  <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Distance</div>
                </div>
                <div>
                  <div className="font-display font-medium text-lg text-fg">{d.resp}</div>
                  <div className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Avg response</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonorNetwork;
