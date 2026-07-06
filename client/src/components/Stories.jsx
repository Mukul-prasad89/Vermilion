import React from 'react';

const Stories = () => (
  <section className="py-24 md:py-32 bg-bg-3" id="stories">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="flex justify-between items-end mb-20 gap-12 flex-wrap">
        <div className="max-w-[700px]">
          <div className="text-[11px] tracking-[0.25em] uppercase text-vermillion mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-vermillion"></span> Impact · stories
          </div>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-none tracking-tight">
            Minutes, measured <em className="italic text-vermillion font-normal">in heartbeats.</em>
          </h2>
        </div>
        <p className="text-base text-fg-dim max-w-sm leading-relaxed">
          Real accounts from donors, recipients, and the medical staff who stood between the two.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { quote: 'I got the ping at 2:47am. By 3:15 I was at the hospital. They told me later — another ten minutes and she wouldn\'t have made it. She\'s eight.', name: 'Karan Mehta', role: 'Donor · O− · Mumbai', seed: 'donor-karan' },
          { quote: 'Before Vermilion, we\'d call. And call. And call. Now the blood finds us. I run a trauma ward — I cannot imagine going back to the old way.', name: 'Dr. Ananya Rao', role: 'Head of Trauma · Aster', seed: 'dr-rao' },
          { quote: 'My father needed AB−. Do you know how rare that is? Vermilion found three donors within 4km in under a minute. Three. I cried.', name: 'Priya Nair', role: 'Recipient\'s daughter', seed: 'priya' }
        ].map((s, i) => (
          <div key={i} className="border border-line bg-white p-8 md:p-9 transition-all hover:border-vermillion hover:shadow-xl hover:shadow-vermillion/5">
            <div className="font-display text-7xl text-vermillion leading-[0.6] mb-3 font-extrabold">“</div>
            <p className="font-display font-light text-lg leading-relaxed text-fg mb-7 italic">{s.quote}</p>
            <div className="flex items-center gap-3.5 pt-5 border-t border-line">
              <img src={`https://picsum.photos/seed/${s.seed}/100/100.jpg`} alt={s.name} className="w-11 h-11 rounded-full object-cover" />
              <div>
                <div className="text-sm text-fg font-medium">{s.name}</div>
                <div className="text-[11px] text-muted uppercase tracking-wider mt-0.5">{s.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stories;
