import React from 'react';

const Footer = () => (
  <footer className="border-t border-line pt-16 pb-8 bg-bg-3">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
        <div>
          <a href="#" className="flex items-center gap-3 text-fg mb-4">
            <div className="w-7 h-7">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 4 C 10 12, 6 18, 6 22 C 6 27, 10 30, 16 30 C 22 30, 26 27, 26 22 C 26 18, 22 12, 16 4 Z" fill="url(#lg2)"/>
                <defs>
                  <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF4D5A"/>
                    <stop offset="1" stopColor="#C1121F"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-syne font-bold text-2xl tracking-wide">VERMILION</span>
          </a>
          <p className="text-sm text-fg-dim max-w-sm leading-relaxed">
            The emergency blood network. Built by medics, engineers, and donors who got tired of waiting. Operating across 190 cities, 24/7.
          </p>
        </div>
        {[
          { title: 'Network', links: ['Find blood', 'Become a donor', 'Hospital partner', 'Corporate drive'] },
          { title: 'Company', links: ['About', 'Impact report', 'Press', 'Careers'] },
          { title: 'Emergency', links: ['Hotline · 1800-VERM', 'SMS BLOOD to 56767', 'Hospital login', 'Verified partner banks'] }
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-vermillion mb-5 font-medium">{col.title}</h4>
            <ul className="list-none space-y-3">
              {col.links.map(link => <li key={link}><a href="#" className="text-sm text-fg-dim transition-colors hover:text-vermillion">{link}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-line flex justify-between items-center text-xs text-muted flex-wrap gap-4">
        <div>© 2026 Vermilion Network Pvt. Ltd. · All rights reserved</div>
        <div className="flex items-center gap-2 text-vermillion font-medium">
          <i className="fa-solid fa-heart-pulse"></i>
          Every 2 seconds, someone needs blood.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
