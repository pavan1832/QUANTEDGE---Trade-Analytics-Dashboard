import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [marketOpen, setMarketOpen] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now);
      // NYSE: Mon–Fri 9:30–16:00 ET (approximate)
      const day = now.getDay();
      const hours = now.getUTCHours() - 5; // UTC-5 EST
      const mins = now.getUTCMinutes();
      const totalMins = hours * 60 + mins;
      setMarketOpen(day >= 1 && day <= 5 && totalMins >= 570 && totalMins < 960);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 14L7 8L11 12L15 6L18 9" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="18" cy="9" r="2" fill="var(--accent)"/>
          </svg>
        </div>
        <div className="navbar__brand-text">
          <span className="navbar__name">QUANT<span className="navbar__accent">EDGE</span></span>
          <span className="navbar__tagline">Trading Analytics</span>
        </div>
      </div>

      <div className="navbar__center">
        <div className={`market-status ${marketOpen ? 'open' : 'closed'}`}>
          <span className="market-status__dot" />
          <span className="market-status__label">NYSE {marketOpen ? 'OPEN' : 'CLOSED'}</span>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__clock">
          <span className="navbar__time">{formatTime(time)}</span>
          <span className="navbar__tz">ET</span>
        </div>
        <div className="navbar__avatar">JD</div>
      </div>
    </nav>
  );
};

export default Navbar;
