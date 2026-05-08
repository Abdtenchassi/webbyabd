'use client';
import { useState, useRef, useEffect } from 'react';

/* ── Feature contract (cost hidden from user, sent to admin only) ── */
const CONTRACT_DATA = [
  { category: 'Core Website Infrastructure', cost: 150, items: [
    { id: 'c1', label: 'Mobile-first responsive design' },{ id: 'c2', label: 'Custom branding (colors, fonts, logo placement)' },{ id: 'c3', label: 'SEO-friendly page structure & meta tags' },{ id: 'c4', label: 'SSL certificate & automatic daily backups' },{ id: 'c5', label: 'Progressive Web App (installable on phone)' },{ id: 'c6', label: 'Fast hosting & CDN setup' },{ id: 'c7', label: 'Google Analytics / visitor tracking' },{ id: 'c8', label: 'Contact form with email notifications' },{ id: 'c9', label: 'Social media links & share buttons' },{ id: 'c10', label: 'Multi-language support (Arabic / English / French)' },
  ]},
  { category: 'Online Shop / E-Commerce', cost: 100, items: [
    { id: 'e1', label: 'Product catalog with categories & filters' },{ id: 'e2', label: 'Shopping cart & multi-step checkout' },{ id: 'e3', label: 'Inventory management & stock tracking' },{ id: 'e4', label: 'Discount codes & promotional banners' },{ id: 'e5', label: 'Product image gallery with zoom' },{ id: 'e6', label: 'Size / color / variant selection' },{ id: 'e7', label: 'Order tracking & status updates' },{ id: 'e8', label: 'Customer accounts & order history' },{ id: 'e9', label: 'Wishlist & favorites' },
  ]},
  { category: 'Booking & Reservations', cost: 50, items: [
    { id: 'b1', label: 'Online booking / reservation form' },{ id: 'b2', label: 'Date, time & duration picker' },{ id: 'b3', label: 'Calendar sync (Apple / Google Calendar)' },{ id: 'b4', label: 'Automatic confirmation & reminder emails' },{ id: 'b5', label: 'Service / package selection' },{ id: 'b6', label: 'Staff / provider assignment' },{ id: 'b7', label: 'Cancellation & rescheduling system' },{ id: 'b8', label: 'WhatsApp notification integration' },
  ]},
  { category: 'Restaurant & Food', cost: 50, items: [
    { id: 'r1', label: 'Digital menu with categories & images' },{ id: 'r2', label: 'Online ordering (dine-in / pickup / delivery)' },{ id: 'r3', label: 'Special offers & daily specials section' },{ id: 'r4', label: 'Table reservation system' },{ id: 'r5', label: 'Dietary labels & allergen information' },{ id: 'r6', label: 'QR code menu for in-restaurant use' },{ id: 'r7', label: 'Delivery zone & fee configuration' },
  ]},
  { category: 'Admin Dashboard', cost: 50, items: [
    { id: 'a1', label: 'Admin panel (manage everything from phone)' },{ id: 'a2', label: 'View & manage all orders / bookings' },{ id: 'a3', label: 'Revenue & analytics dashboard' },{ id: 'a4', label: 'Customer database & contact list' },{ id: 'a5', label: 'Content editor (update text, images, menu)' },{ id: 'a6', label: 'Export data (CSV / PDF reports)' },{ id: 'a7', label: 'Role-based access (owner / staff)' },
  ]},
  { category: 'Payments & Billing', cost: 50, items: [
    { id: 'p1', label: 'Whish / OMT payment integration' },{ id: 'p2', label: 'Credit / debit card processing' },{ id: 'p3', label: 'Invoice & receipt generation (PDF)' },{ id: 'p4', label: 'Deposit & partial payment support' },{ id: 'p5', label: 'Subscription / recurring billing' },{ id: 'p6', label: 'Multi-currency display (USD / LBP)' },
  ]},
];

const PORTFOLIO = [
  { name: 'Lens.lb', type: 'Photography Marketplace', url: 'https://lebnslb.onrender.com', screenshot: '/screenshots/lenslb.png', tags: ['Marketplace','Booking'] },
  { name: 'Noonphotoo', type: 'Photography Booking', url: 'https://noonphotoo.onrender.com', screenshot: '/screenshots/noonphotoo.png', tags: ['Booking','Studio'] },
  { name: 'Half the Way', type: 'Baby E-Commerce', url: 'https://halftheway.onrender.com', screenshot: '/screenshots/halftheway.png', tags: ['E-Commerce','Cart'] },
  { name: 'CFC', type: 'Restaurant Ordering', url: 'https://cfc-website-1jxt.onrender.com', screenshot: '/screenshots/cfc.png', tags: ['Restaurant','Ordering'] },
];

const STEPS = [
  { num: '01', title: 'Share Your Vision', desc: 'Send us your logo, moodboard, and select the features you need from our project builder.', icon: 'send' },
  { num: '02', title: 'We Confirm & Quote', desc: 'We review your requirements, confirm feasibility, and send a clear fixed-price scope.', icon: 'check' },
  { num: '03', title: 'Pay a Deposit', desc: 'Secure your spot with a deposit. We start building immediately with full attention.', icon: 'wallet' },
  { num: '04', title: 'Live in 48 Hours', desc: 'Your mobile-first website goes live. Fully functional, hosted, and ready for customers.', icon: 'rocket' },
];

const SERVICES = [
  { title: 'Lightning-Fast Sites', desc: 'SEO-optimized, instant-loading on any screen.', icon: 'bolt' },
  { title: 'E-Commerce Stores', desc: 'Cart, payments, inventory — sell from day one.', icon: 'cart' },
  { title: 'Installable Web Apps', desc: 'Add to home screen — no app store needed.', icon: 'phone' },
  { title: 'Admin Dashboards', desc: 'Manage orders, bookings, content from your phone.', icon: 'chart' },
  { title: 'Booking Systems', desc: 'Appointments, tables, sessions with auto-reminders.', icon: 'calendar' },
  { title: 'Payment Integration', desc: 'Whish, OMT, cards — invoices auto-generated.', icon: 'dollar' },
];

/* ── Hosting Questions & Tier Mapping ── */
const HOSTING_QS = [
  { key: 'visitors', q: 'How many people will visit your site daily?', opts: [
    { val: 'few', label: 'Just starting out (under 100/day)' },
    { val: 'hundreds', label: 'A few hundred per day' },
    { val: 'thousands', label: 'Thousands per day' },
    { val: 'massive', label: 'Tens of thousands or more' },
  ]},
  { key: 'accounts', q: 'Will customers create accounts on your site?', opts: [
    { val: 'none', label: 'No, just a public website' },
    { val: 'some', label: 'Yes, up to a few hundred' },
    { val: 'many', label: 'Yes, thousands of users' },
  ]},
  { key: 'content', q: 'How much content will you manage?', opts: [
    { val: 'light', label: 'Simple site with a few pages' },
    { val: 'medium', label: 'Dozens of products/items with photos' },
    { val: 'heavy', label: 'Hundreds of products or large catalog' },
  ]},
  { key: 'speed', q: 'Is it okay if the site takes a moment to load after being idle?', opts: [
    { val: 'relaxed', label: "That's fine — I'm just starting" },
    { val: 'always', label: 'No, it must always load instantly' },
  ]},
];

const HOSTING_TIERS = {
  free:    { name: 'Launch',   color: '#64748B', clientPrice: 0,   render: { tier: 'Free',     price: 0,  ram: '512 MB', cpu: '0.1 vCPU', note: 'Sleeps after 15min idle' }, supabase: { tier: 'Free', price: 0,  db: '500 MB', mau: '50K', note: 'Pauses after 7 days idle' }},
  starter: { name: 'Starter',  color: '#2563EB', clientPrice: 19,  render: { tier: 'Starter',  price: 7,  ram: '512 MB', cpu: '0.5 vCPU', note: 'Always on' },              supabase: { tier: 'Free', price: 0,  db: '500 MB', mau: '50K', note: 'Always active' }},
  growth:  { name: 'Growth',   color: '#7C3AED', clientPrice: 79,  render: { tier: 'Standard', price: 25, ram: '2 GB',   cpu: '1 vCPU',   note: 'Always on, fast' },          supabase: { tier: 'Pro',  price: 25, db: '8 GB',   mau: '100K', note: 'Daily backups' }},
  business:{ name: 'Business', color: '#059669', clientPrice: 149, render: { tier: 'Pro',      price: 85, ram: '4 GB',   cpu: '2 vCPU',   note: 'High performance' },        supabase: { tier: 'Pro',  price: 25, db: '8 GB',   mau: '100K', note: 'Daily backups' }},
};

function computeHostingTier(h) {
  if (!h.visitors || !h.speed) return null;
  if (h.speed === 'relaxed' && h.visitors === 'few' && h.content !== 'heavy') return 'free';
  if (h.visitors === 'massive' || (h.visitors === 'thousands' && h.content === 'heavy')) return 'business';
  if (h.visitors === 'thousands' || h.accounts === 'many' || h.content === 'heavy') return 'growth';
  if (h.visitors === 'hundreds' || h.content === 'medium' || h.accounts === 'some') return 'starter';
  return 'starter';
}

function getHostingDetails(tierKey) {
  const t = HOSTING_TIERS[tierKey]; if (!t) return null;
  const infraCost = t.render.price + t.supabase.price;
  const renderWorkspace = 19;
  const realCost = infraCost + renderWorkspace;
  const profit = t.clientPrice - infraCost;
  return { ...t, infraCost, renderWorkspace, realCost, profit, tierKey };
}

/* ── Icons ── */
const I = ({ t, s = 22, c = 'currentColor' }) => {
  const p = { width: s, height: s, fill: 'none', stroke: c, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' };
  const m = {
    bolt: <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    cart: <svg {...p}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>,
    phone: <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
    chart: <svg {...p}><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    dollar: <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    send: <svg {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
    check: <svg {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
    wallet: <svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
    rocket: <svg {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    arrow: <svg {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    ext: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>,
    pin: <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  };
  return m[t] || null;
};

/* ── Main ── */
export default function Home() {
  const [sel, setSel] = useState({});
  const [showBuilder, setShowBuilder] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', business: '', contact: '', notes: '' });
  const [menuOpen, setMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [activeCard, setActiveCard] = useState(0);
  const [hosting, setHosting] = useState({});
  const builderRef = useRef(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const tabletRef = useRef(null);
  const scrollHeaderRef = useRef(null);
  const scrollSectionRef = useRef(null);

  // Persistent countdown
  useEffect(() => {
    const key = 'webby_cd';
    let tgt;
    const saved = typeof window !== 'undefined' && localStorage.getItem(key);
    if (saved && new Date(saved).getTime() > Date.now()) tgt = new Date(saved);
    else { tgt = new Date(); tgt.setDate(tgt.getDate() + 7); tgt.setHours(0,0,0,0); if (typeof window !== 'undefined') localStorage.setItem(key, tgt.toISOString()); }
    const tick = () => { const d = tgt.getTime() - Date.now(); if (d <= 0) return setCountdown({ h:0, m:0, s:0 }); setCountdown({ h: Math.floor(d/36e5), m: Math.floor((d%36e5)/6e4), s: Math.floor((d%6e4)/1e3) }); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  // WebGL Shader
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; let aid;
    import('three').then(T => {
      const sc = new T.Scene(), r = new T.WebGLRenderer({ canvas, alpha: true });
      r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(new T.Color(0xFAFBFF));
      const cam = new T.OrthographicCamera(-1,1,1,-1,0,-1);
      const u = { res: { value: [innerWidth, innerHeight] }, t: { value: 0 } };
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,-1,0,-1,1,0,1,1,0]), 3));
      sc.add(new T.Mesh(g, new T.RawShaderMaterial({ vertexShader: 'attribute vec3 position;void main(){gl_Position=vec4(position,1.0);}', fragmentShader: 'precision highp float;uniform vec2 res;uniform float t;void main(){vec2 p=(gl_FragCoord.xy*2.0-res)/min(res.x,res.y);float d=length(p)*.04;float rx=p.x*(1.+d);float gx=p.x;float bx=p.x*(1.-d);float rv=.04/abs(p.y+sin((rx+t)*1.2)*.4);float gv=.04/abs(p.y+sin((gx+t)*1.2)*.4);float bv=.04/abs(p.y+sin((bx+t)*1.2)*.4);gl_FragColor=vec4(rv*.08+.97,gv*.22+.96,bv*.85+.95,1.);}', uniforms: u, side: T.DoubleSide })));
      const rs = () => { r.setSize(innerWidth, innerHeight, false); u.res.value = [innerWidth, innerHeight]; }; rs(); addEventListener('resize', rs);
      (function a() { u.t.value += .005; r.render(sc, cam); aid = requestAnimationFrame(a); })();
    });
    return () => { if (aid) cancelAnimationFrame(aid); };
  }, []);

  // Container Scroll
  useEffect(() => {
    const s = scrollSectionRef.current, tb = tabletRef.current, hd = scrollHeaderRef.current;
    if (!s || !tb) return;
    const up = () => { const r = s.getBoundingClientRect(), h = s.offsetHeight, p = Math.max(0, Math.min(1, -r.top / (h - innerHeight))); const rot = 20*(1-p), sc = innerWidth<=768?(.7+.2*p):(1.05-.05*p); tb.style.transform = `perspective(1000px) rotateX(${rot}deg) scale(${sc})`; if (hd) hd.style.transform = `translateY(${-100*p}px)`; };
    addEventListener('scroll', up, { passive: true }); up(); return () => removeEventListener('scroll', up);
  }, []);

  const toggle = (ci, fi) => setSel(p => { const cat = p[ci] || {}; return { ...p, [ci]: { ...cat, [fi]: !cat[fi] } }; });
  let estimate = 0; Object.keys(sel).forEach(i => { if (Object.values(sel[i]).some(v => v)) estimate += CONTRACT_DATA[i].cost; });
  const totalSel = Object.values(sel).reduce((s, c) => s + Object.values(c).filter(Boolean).length, 0);
  const handleSubmit = async () => {
    if (!form.name || !form.contact || totalSel === 0) return; setSubmitting(true);
    const fl = []; CONTRACT_DATA.forEach((cat, i) => cat.items.forEach(it => { if (sel[i]?.[it.id]) fl.push(it.label); }));
    const files = fileRef.current?.files; let fn = ''; if (files?.length) fn = Array.from(files).map(f => f.name).join(', ');
    const tierKey = computeHostingTier(hosting);
    const hd = tierKey ? getHostingDetails(tierKey) : null;
    const hostingData = hd ? {
      tierKey, tierName: hd.name,
      clientPrice: hd.clientPrice, infraCost: hd.infraCost,
      renderWorkspace: hd.renderWorkspace, realCost: hd.realCost,
      profit: hd.profit,
      render: hd.render, supabase: hd.supabase,
      answers: hosting,
    } : null;
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_name: form.name.trim(), client_business: form.business.trim(), email_phone: form.contact.trim(), notes: form.notes.trim(), features: fl, estimateMin: estimate, estimateMax: estimate + 100, attached_files: fn, hosting: hostingData }) });
      const data = await res.json(); if (data.success) setSubmitted(true); else alert('Error: ' + data.error);
    } catch { alert('Network error.'); } setSubmitting(false);
  };
  const scrollToBuilder = () => { setShowBuilder(true); setMenuOpen(false); setTimeout(() => builderRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  if (submitted) return (<><style>{CSS}</style><div className="success-wrap"><div className="success-card"><div className="success-check"><svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 16l6 6L26 10"/></svg></div><h2 className="success-title">Request Submitted!</h2><p className="success-text">Thank you, {form.name}. We&apos;ll review your project and reach out within 24 hours.</p><button className="btn-primary full-w" onClick={() => { setSubmitted(false); setSel({}); setForm({ name:'',business:'',contact:'',notes:'' }); setShowBuilder(false); }}>Start New Project</button></div></div></>);

  return (<><style>{CSS}</style>
    {/* NAV */}
    <nav className="nav"><div className="nav-inner">
      <img src="/logo_web.png" alt="WebbyAbd" className="logo-img"/>
      <div className={`nav-links ${menuOpen?'open':''}`}>
        <a href="#work" className="nav-link" onClick={()=>setMenuOpen(false)}>Work</a>
        <a href="#process" className="nav-link" onClick={()=>setMenuOpen(false)}>Process</a>
        <a href="#services" className="nav-link" onClick={()=>setMenuOpen(false)}>Services</a>
        <button className="nav-cta" onClick={scrollToBuilder}>Start a Project</button>
      </div>
      <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu"><span className={`ham-line ${menuOpen?'open':''}`}/><span className={`ham-line ${menuOpen?'open':''}`}/><span className={`ham-line ${menuOpen?'open':''}`}/></button>
    </div></nav>

    {/* HERO */}
    <section className="hero"><canvas ref={canvasRef} className="hero-canvas"/><div className="hero-overlay"/>
      <div className="hero-content">
        <div className="hero-badge"><span className="badge-dot"/>Accepting New Projects</div>
        <h1 className="hero-title"><span className="hero-grad">Mobile-first</span> websites that convert visitors into customers</h1>
        <p className="hero-sub">Web platforms designed for Lebanese businesses. Built to perform on every phone, priced to scale.</p>
        <div className="hero-ctas"><button className="btn-primary" onClick={scrollToBuilder}>Build Your Project <I t="arrow" s={16} c="#fff"/></button><a href="#work" className="btn-ghost">See Our Work</a></div>
        <div className="hero-values"><div className="hero-value"><I t="phone" s={18} c="#1A56DB"/><span>Mobile-First Always</span></div><div className="hero-value"><I t="pin" s={18} c="#1A56DB"/><span>Based in Lebanon</span></div><div className="hero-value"><I t="bolt" s={18} c="#1A56DB"/><span>Delivered in Days</span></div></div>
      </div>
    </section>

    {/* WORK */}
    <section id="work" className="section"><div className="section-inner" style={{textAlign:'center'}}><div className="section-label">Our Work</div><h2 className="section-title">Real projects. Live now.</h2><p className="section-sub" style={{margin:'0 auto 1.5rem'}}>Each project built mobile-first, generating real results for Lebanese businesses.</p></div>
      <div className="card-stack-wrap"><div className="card-stack-area">
        {[0,1,2].map(off => { const p = PORTFOLIO[(activeCard+off)%PORTFOLIO.length]; return (<div key={`${activeCard}-${off}`} className="s-card" style={{zIndex:3-off,transform:`translateX(-50%) translateY(${off===0?12:off===1?-16:-44}px) scale(${off===0?1:off===1?.95:.9})`}}><img src={p.screenshot} alt={p.name} className="s-card-img"/><div className="s-card-info"><div className="s-card-text"><h3>{p.name}</h3><p>{p.type}</p></div><a href={p.url} target="_blank" rel="noopener noreferrer" className="s-card-btn">Visit <I t="ext" s={14}/></a></div></div>); })}
      </div><div className="stack-nav"><button className="stack-btn" onClick={()=>setActiveCard(v=>(v+1)%PORTFOLIO.length)}>Next Project <I t="arrow" s={14}/></button></div></div>
    </section>

    {/* HOW IT WORKS */}
    <section id="process" className="section section-alt"><div className="section-inner" style={{textAlign:'center'}}><div className="section-label">How It Works</div><h2 className="section-title">From idea to live website <span className="hero-grad">in 48 hours</span></h2><p className="section-sub" style={{margin:'0 auto 2rem'}}>A simple, transparent process. No back-and-forth for weeks — just results.</p></div>
      <div className="steps-grid">{STEPS.map((st,i)=>(<div key={i} className="step-card"><div className="step-num-wrap"><div className="step-num">{st.num}</div>{i<3&&<div className="step-line"/>}</div><div className="step-icon"><I t={st.icon} s={24} c="#1A56DB"/></div><h3 className="step-title">{st.title}</h3><p className="step-desc">{st.desc}</p></div>))}</div>
      <div style={{textAlign:'center',marginTop:'2rem',display:'flex',justifyContent:'center'}}><button className="btn-primary" onClick={scrollToBuilder} style={{maxWidth:340}}>Start Your Project Now <I t="arrow" s={16} c="#fff"/></button></div>
    </section>

    {/* MOBILE-FIRST TABLET */}
    <section className="scroll-section" ref={scrollSectionRef}><div className="scroll-wrap">
      <div className="scroll-header" ref={scrollHeaderRef}><div className="section-label" style={{justifyContent:'center'}}>Why Mobile-First</div><h2 className="section-title" style={{textAlign:'center'}}>Your customers are on their phones.<br/><span className="hero-grad">Your website should be too.</span></h2><p className="scroll-sub">85% of Lebanese users browse on mobile. Every site we build starts with the smallest screen and scales up.</p></div>
      <div className="tablet" ref={tabletRef}><div className="tablet-screen">
        {[{img:'/screenshots/lenslb-mobile.jpg',n:'Lens.lb',t:'Photography'},{img:'/screenshots/halftheway-mobile.jpg',n:'Half the Way',t:'E-Commerce'},{img:'/screenshots/noonphotoo-mobile.jpg',n:'Noonphotoo',t:'Booking'}].map((p,i)=>(<div key={i} className="tablet-phone"><img src={p.img} alt={p.n}/><div className="tablet-phone-label"><strong>{p.n}</strong><span>{p.t}</span></div></div>))}
      </div></div>
      <div className="scroll-stats"><div><div className="stat-num">85%</div><div className="stat-lbl">Mobile users in LB</div></div><div><div className="stat-num">&lt;2s</div><div className="stat-lbl">Load time target</div></div><div><div className="stat-num">48px</div><div className="stat-lbl">Min touch target</div></div></div>
    </div></section>

    {/* SERVICES */}
    <section id="services" className="section"><div className="section-inner"><div className="section-label">What We Build</div><h2 className="section-title">Everything your business needs</h2><p className="section-sub">From first pixel to deployment — designed for thumbs, built for speed.</p>
      <div className="serv-grid">{SERVICES.map((sv,i)=>(<div key={i} className="serv-card"><div className="serv-icon"><I t={sv.icon} s={22} c="#1A56DB"/></div><div><h3 className="serv-title">{sv.title}</h3><p className="serv-desc">{sv.desc}</p></div></div>))}</div>
    </div></section>

    {/* COUNTDOWN */}
    {!showBuilder && (<section className="countdown-section"><div className="countdown-inner"><div className="cd-badge"><span className="cd-badge-dot"/>Early Access Opening Soon</div><h2 className="cd-title">Limited spots available</h2><p className="cd-sub">Be among the first businesses to get a custom-built mobile platform.</p>
      {countdown && (<div className="cd-timer">{['h','m','s'].map((k,i)=>(<div key={k} style={{display:'contents'}}>{i>0&&<span className="cd-colon">:</span>}<div className="cd-unit"><div className="cd-box"><span className="cd-digit">{String(countdown[k]).padStart(2,'0')}</span></div><span className="cd-lbl">{k==='h'?'Hours':k==='m'?'Minutes':'Seconds'}</span></div></div>))}</div>)}
      <div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'center'}}><button className="btn-primary" style={{maxWidth:340}} onClick={scrollToBuilder}>Get Started Now <I t="arrow" s={16} c="#fff"/></button><a href="#work" className="btn-ghost" style={{maxWidth:340,textDecoration:'none',textAlign:'center'}}>See Our Work</a></div>
    </div></section>)}

    {/* BUILDER */}
    {showBuilder && (<section ref={builderRef} className="builder-section"><div className="section-inner"><div className="section-label">Project Builder</div><h2 className="section-title">Tell us what you need</h2><p className="builder-sub">Select every feature that applies. We&apos;ll review and send a tailored proposal.</p>
      <div className="builder-card"><h3 className="builder-card-title">Your Details</h3><div className="form-grid"><div className="input-group"><label className="input-label">Your Name *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe"/></div><div className="input-group"><label className="input-label">Business Name</label><input className="input" value={form.business} onChange={e=>setForm({...form,business:e.target.value})} placeholder="Dar el Sama"/></div></div><div className="input-group"><label className="input-label">Email or WhatsApp *</label><input className="input" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="+961 70 XXX XXX"/></div><div className="input-group"><label className="input-label">Upload Logo / Moodboard (Optional)</label><input type="file" ref={fileRef} multiple accept="image/*,.pdf" className="input file-input"/></div><div className="input-group"><label className="input-label">Additional Notes</label><textarea className="input textarea" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Design style, deadline, reference sites..."/></div></div>
      {CONTRACT_DATA.map((cat,ci)=>(<div key={ci} className="builder-card"><h3 className="builder-card-title"><I t={['phone','cart','calendar','dollar','chart','wallet'][ci]} s={20} c="#1A56DB"/><span className="cat-name">{cat.category}</span></h3><div className="feat-grid">{cat.items.map(item=>{const on=sel[ci]?.[item.id];return(<div key={item.id} className={`feat-card ${on?'sel':''}`} onClick={()=>toggle(ci,item.id)}><div className={`feat-check ${on?'checked':''}`}>{on&&<svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-6"/></svg>}</div><span className="feat-label">{item.label}</span></div>);})}</div></div>))}

      {/* HOSTING NEEDS */}
      <div className="builder-card hosting-card">
        <h3 className="builder-card-title"><I t="chart" s={20} c="#1A56DB"/><span className="cat-name">Hosting & Performance Needs</span></h3>
        <p style={{color:'var(--muted)',fontSize:'.85rem',marginBottom:'1.25rem',lineHeight:1.6}}>Answer a few quick questions so we can recommend the right hosting plan for your business. This helps us give you an accurate monthly cost.</p>
        {HOSTING_QS.map(q => (
          <div key={q.key} className="hosting-q">
            <label className="hosting-q-label">{q.q}</label>
            <div className="hosting-opts">
              {q.opts.map(o => (
                <div key={o.val} className={`hosting-opt ${hosting[q.key]===o.val?'sel':''}`} onClick={()=>setHosting(p=>({...p,[q.key]:o.val}))}>
                  <span className="hosting-opt-text">{o.label}</span>
                  {hosting[q.key]===o.val && <div className="hosting-opt-check"><svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></div>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Result — client sees simple monthly cost only */}
        {(() => {
          const tierKey = computeHostingTier(hosting);
          if (!tierKey) return null;
          const hd = getHostingDetails(tierKey);
          const answered = HOSTING_QS.every(q => hosting[q.key]);
          if (!answered) return null;
          return (
            <div className="hosting-result">
              <div className="hosting-result-header">
                <div className="hosting-result-badge" style={{background: hd.color}}>{hd.name} Plan</div>
                <div className="hosting-result-price">
                  <span className="hosting-price-amount">${hd.clientPrice}</span>
                  <span className="hosting-price-period">/month</span>
                </div>
              </div>
              <div className="hosting-result-desc">
                {tierKey === 'free' && 'Perfect for testing your idea. Your site may take a few seconds to load after being idle — great for launching and validating your business.'}
                {tierKey === 'starter' && "Your site stays online 24/7 with no delays. Ideal for a small business that's just getting started and building its customer base."}
                {tierKey === 'growth' && 'Built for a growing business with real traffic. Fast performance, room for lots of products, and your customer data is backed up daily.'}
                {tierKey === 'business' && 'High-performance hosting for serious traffic. Your site handles thousands of visitors smoothly with maximum speed and reliability.'}
              </div>
              <div className="hosting-result-includes">
                <div className="hosting-inc-title">What&apos;s included:</div>
                <div className="hosting-inc-item"><span className="hosting-inc-dot" style={{background:'#22c55e'}}/>Your website always online{tierKey !== 'free' ? ' — no delays' : ' (may sleep when idle)'}</div>
                <div className="hosting-inc-item"><span className="hosting-inc-dot" style={{background:'#3b82f6'}}/>Database for your {hosting.content === 'heavy' ? 'large catalog' : hosting.content === 'medium' ? 'products & orders' : 'content'}</div>
                <div className="hosting-inc-item"><span className="hosting-inc-dot" style={{background:'#8b5cf6'}}/>{hosting.accounts !== 'none' ? `User accounts for your ${hosting.accounts === 'many' ? 'thousands of' : 'hundreds of'} customers` : 'Public website — no login needed'}</div>
                {tierKey !== 'free' && <div className="hosting-inc-item"><span className="hosting-inc-dot" style={{background:'#f59e0b'}}/>Automatic daily backups</div>}
              </div>
            </div>
          );
        })()}
      </div>

    </div><div className="sticky-footer"><div className="sticky-inner"><div className="sticky-info"><div className="sticky-count">{totalSel}</div><div className="sticky-text">features selected</div></div><button className="btn-primary sticky-btn" disabled={submitting||totalSel===0||!form.name||!form.contact} onClick={handleSubmit}>{submitting?'Submitting...':'Submit Request'}</button></div></div></section>)}

    {/* CTA */}
    <section className="cta-banner"><h2 className="cta-title">Ready to go mobile-first?</h2><p className="cta-sub">Tell us what you need. We&apos;ll build it, launch it, and help you grow — all within days.</p><button className="cta-btn" onClick={scrollToBuilder}>Start Your Project</button></section>

    {/* FOOTER */}
    <footer className="footer"><div className="footer-content"><img src="/logo_web.png" alt="WebbyAbd" className="logo-img" style={{margin:'0 auto'}}/><p className="footer-tag">Mobile-first web platforms for Lebanese businesses.</p><div className="footer-copy">&copy; {new Date().getFullYear()} WebbyAbd. All rights reserved.</div></div></footer>
  </>);
}

/* ═══ CSS ═══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#FAFBFF;--bg2:#F0F4FF;--surface:#fff;--card:#fff;--border:#E2E8F0;--text:#0F172A;--text2:#334155;--muted:#64748B;--blue:#1A56DB;--blue-light:#E0E7FF;--accent:#2563EB}
html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
button,a{min-height:48px}
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(250,251,255,.88);border-bottom:1px solid var(--border)}.nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:.7rem 1rem}.logo-img{height:34px}.nav-links{display:none;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:var(--surface);border-bottom:1px solid var(--border);padding:1rem;box-shadow:0 12px 40px rgba(0,0,0,.08)}.nav-links.open{display:flex}.nav-link{color:var(--muted);text-decoration:none;font-size:.95rem;font-weight:500;padding:.85rem 1rem;border-radius:10px;transition:all .2s;display:flex;align-items:center}.nav-link:hover{color:var(--blue);background:var(--blue-light)}.nav-cta{background:var(--blue);color:#fff;border:none;padding:.65rem 1.4rem;border-radius:10px;font-size:.88rem;font-weight:600;cursor:pointer;font-family:'DM Sans';box-shadow:0 2px 12px rgba(26,86,219,.25);width:100%;margin-top:.5rem}.hamburger{display:flex;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:10px;min-height:48px;min-width:48px;align-items:center;justify-content:center}.ham-line{width:20px;height:2px;background:var(--text);border-radius:2px;transition:all .3s}.ham-line.open:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.ham-line.open:nth-child(2){opacity:0}.ham-line.open:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.hero{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:5.5rem 1.25rem 3rem}.hero-canvas{position:absolute;inset:0;z-index:0}.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(250,251,255,.35) 0%,rgba(250,251,255,.75) 50%,var(--bg) 100%);z-index:1}.hero-content{position:relative;z-index:2;text-align:center;max-width:800px;width:100%}.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--blue-light);border:1px solid rgba(26,86,219,.18);color:var(--blue);padding:.4rem 1rem;border-radius:100px;font-size:.75rem;font-weight:600;margin-bottom:1.5rem;opacity:0;animation:fadeUp .7s ease forwards .15s}.badge-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite;flex-shrink:0}.hero-title{font-family:'Outfit';font-size:2.1rem;font-weight:800;line-height:1.1;letter-spacing:-.04em;margin-bottom:1.25rem;opacity:0;animation:fadeUp .7s ease forwards .3s}.hero-grad{background:linear-gradient(135deg,#1A56DB,#2563EB,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero-sub{color:var(--muted);font-size:.95rem;line-height:1.7;margin:0 auto 2rem;max-width:540px;opacity:0;animation:fadeUp .7s ease forwards .45s}.hero-ctas{display:flex;flex-direction:column;gap:10px;opacity:0;animation:fadeUp .7s ease forwards .6s}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--blue);color:#fff;border:none;padding:.9rem 1.8rem;border-radius:12px;font-weight:600;font-size:.95rem;cursor:pointer;font-family:'DM Sans';box-shadow:0 4px 20px rgba(26,86,219,.3);transition:all .25s;min-height:52px;width:100%}.btn-primary:hover{background:var(--accent);transform:translateY(-2px);box-shadow:0 8px 30px rgba(26,86,219,.35)}.btn-primary:active{transform:scale(.97)}.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--surface);color:var(--text2);border:1.5px solid var(--border);padding:.9rem 1.8rem;border-radius:12px;font-weight:600;font-size:.95rem;cursor:pointer;font-family:'DM Sans';transition:all .25s;text-decoration:none;min-height:52px;width:100%}.btn-ghost:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-light)}.full-w{width:100%;max-width:320px}
.hero-values{display:flex;flex-direction:column;gap:10px;margin-top:2.5rem;opacity:0;animation:fadeUp .7s ease forwards .75s}.hero-value{display:flex;align-items:center;justify-content:center;gap:8px;font-size:.85rem;color:var(--muted);font-weight:500}
.section{padding:4rem 1.25rem}.section-alt{background:var(--bg2)}.section-inner{max-width:1100px;margin:0 auto}.section-label{display:inline-flex;align-items:center;gap:6px;color:var(--blue);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.75rem}.section-label::before{content:'';width:16px;height:2px;background:var(--blue);border-radius:2px}.section-title{font-family:'Outfit';font-size:1.7rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.5rem;line-height:1.15}.section-sub{color:var(--muted);max-width:520px;font-size:.9rem;line-height:1.7;margin-bottom:2rem}
.card-stack-wrap{display:flex;flex-direction:column;align-items:center;padding-top:.5rem}.card-stack-area{position:relative;height:360px;width:100%;max-width:560px;overflow:hidden}.s-card{position:absolute;bottom:0;left:50%;width:94%;max-width:520px;background:var(--card);border:1px solid var(--border);border-bottom:none;border-radius:18px 18px 0 0;padding:6px;overflow:hidden;transition:all .55s cubic-bezier(.4,0,.2,1)}.s-card-img{width:100%;height:200px;border-radius:14px;object-fit:cover;object-position:top;display:block}.s-card-info{display:flex;align-items:center;justify-content:space-between;padding:12px 8px 16px;gap:10px}.s-card-text h3{font-family:'Outfit';font-size:.95rem;font-weight:700;margin-bottom:2px}.s-card-text p{color:var(--muted);font-size:.8rem}.s-card-btn{display:inline-flex;align-items:center;gap:4px;background:var(--blue);color:#fff;padding:.5rem 1rem;border-radius:100px;font-size:.8rem;font-weight:600;text-decoration:none;white-space:nowrap;min-height:40px;box-shadow:0 2px 8px rgba(26,86,219,.2)}.stack-nav{position:relative;z-index:10;display:flex;justify-content:center;border-top:1px solid var(--border);padding:1rem}.stack-btn{display:inline-flex;align-items:center;gap:6px;background:var(--surface);border:1.5px solid var(--border);color:var(--text2);padding:.6rem 1.4rem;border-radius:10px;font-size:.88rem;font-weight:600;cursor:pointer;font-family:'DM Sans';min-height:48px}.stack-btn:active{background:var(--blue-light);border-color:var(--blue);color:var(--blue)}
.steps-grid{display:grid;grid-template-columns:1fr;gap:0;max-width:600px;margin:0 auto}.step-card{text-align:center;padding:1.5rem 1rem;position:relative}.step-num-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:1rem}.step-num{width:48px;height:48px;border-radius:50%;background:var(--blue);color:#fff;font-family:'Outfit';font-size:1rem;font-weight:800;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;box-shadow:0 4px 16px rgba(26,86,219,.25)}.step-line{width:2px;height:40px;background:linear-gradient(to bottom,var(--blue),rgba(26,86,219,.15));margin-top:-2px}.step-icon{width:56px;height:56px;border-radius:16px;background:var(--blue-light);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem}.step-title{font-family:'Outfit';font-size:1.1rem;font-weight:700;margin-bottom:.5rem}.step-desc{color:var(--muted);font-size:.85rem;line-height:1.6;max-width:320px;margin:0 auto}
.scroll-section{height:60rem;display:flex;align-items:center;justify-content:center;position:relative;padding:2rem 1rem;background:var(--bg2)}.scroll-wrap{padding:4rem 0;width:100%;position:relative;max-width:1100px;margin:0 auto}.scroll-header{text-align:center;will-change:transform;transition:transform .08s linear}.scroll-sub{color:var(--muted);text-align:center;max-width:480px;margin:1rem auto 0;font-size:.92rem;line-height:1.6}.tablet{max-width:900px;margin:-1rem auto 0;width:100%;border:4px solid #B0B8C8;padding:6px;background:linear-gradient(145deg,#dde3f0,#c8cfe0);border-radius:22px;box-shadow:0 9px 20px rgba(0,0,0,.1),0 37px 37px rgba(0,0,0,.07),0 84px 50px rgba(0,0,0,.03);will-change:transform;overflow:hidden;transform-origin:center center;transition:transform .08s linear}.tablet-screen{width:100%;overflow:hidden;border-radius:16px;background:var(--bg);display:flex;align-items:stretch}.tablet-phone{flex:1;overflow:hidden;position:relative}.tablet-phone img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}.tablet-phone-label{position:absolute;bottom:0;left:0;right:0;padding:10px 12px;background:linear-gradient(transparent,rgba(0,0,0,.65));color:#fff;font-size:.7rem}.tablet-phone-label strong{display:block;font-family:'Outfit';font-size:.82rem;font-weight:700}.tablet-phone-label span{opacity:.8}.scroll-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:500px;margin:2.5rem auto 0;text-align:center}.stat-num{font-family:'Outfit';font-size:1.5rem;font-weight:800;color:var(--blue)}.stat-lbl{font-size:.68rem;color:var(--muted);font-weight:500;margin-top:2px}
.serv-grid{display:grid;grid-template-columns:1fr;gap:12px}.serv-card{background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:22px;display:flex;gap:16px;align-items:flex-start;transition:all .2s}.serv-card:hover{border-color:rgba(26,86,219,.25);transform:translateY(-2px);box-shadow:0 8px 30px rgba(26,86,219,.06)}.serv-icon{width:44px;height:44px;border-radius:12px;background:var(--blue-light);display:flex;align-items:center;justify-content:center;flex-shrink:0}.serv-title{font-family:'Outfit';font-size:.95rem;font-weight:700;margin-bottom:4px}.serv-desc{color:var(--muted);font-size:.82rem;line-height:1.6}
.countdown-section{padding:4rem 1.25rem;background:var(--bg2)}.countdown-inner{max-width:700px;width:100%;margin:0 auto;text-align:center;padding:2.5rem 1.5rem;border-radius:20px;background:var(--card);border:1.5px solid var(--border);box-shadow:0 8px 40px rgba(26,86,219,.04);position:relative;overflow:hidden}.countdown-inner::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:300px;height:150px;background:radial-gradient(ellipse,rgba(26,86,219,.06),transparent 70%);pointer-events:none}.cd-badge{display:inline-flex;align-items:center;gap:8px;color:var(--blue);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1.25rem;position:relative}.cd-badge-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}.cd-title{font-family:'Outfit';font-size:1.5rem;font-weight:800;letter-spacing:-.03em;margin-bottom:.5rem;position:relative}.cd-sub{color:var(--muted);font-size:.88rem;line-height:1.65;max-width:420px;margin:0 auto 1.75rem;position:relative}.cd-timer{display:flex;align-items:flex-start;justify-content:center;gap:8px;margin-bottom:2rem}.cd-unit{display:flex;flex-direction:column;align-items:center;gap:5px}.cd-box{background:var(--blue-light);border:1px solid rgba(26,86,219,.12);border-radius:12px;padding:12px 14px;min-width:65px}.cd-digit{font-family:'Outfit';font-size:1.8rem;font-weight:700;line-height:1.1;color:var(--blue);display:block}.cd-lbl{font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--muted)}.cd-colon{font-family:'Outfit';font-size:1.4rem;color:rgba(26,86,219,.2);padding-top:12px;animation:pulse 2s infinite}
.builder-section{padding:4rem 1.25rem 9rem;background:var(--bg)}.builder-sub{color:var(--muted);text-align:center;max-width:520px;margin:0 auto 2rem;font-size:.9rem;line-height:1.6}.builder-card{background:var(--card);border-radius:14px;padding:20px;border:1px solid var(--border);margin-bottom:16px;max-width:900px;margin-left:auto;margin-right:auto;box-shadow:0 1px 3px rgba(0,0,0,.04)}.builder-card-title{font-family:'Outfit';font-size:1.05rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.cat-name{flex:1;min-width:0}.form-grid{display:grid;grid-template-columns:1fr;gap:0}.input-group{margin-bottom:14px}.input-label{display:block;font-size:.82rem;font-weight:600;color:var(--muted);margin-bottom:5px}.input{width:100%;padding:.75rem .9rem;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;color:var(--text);font-size:.95rem;font-family:'DM Sans';min-height:48px;transition:border-color .2s,box-shadow .2s}.input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-light)}.textarea{min-height:100px;resize:vertical}.file-input{cursor:pointer;border-style:dashed;color:var(--muted)}.feat-grid{display:grid;grid-template-columns:1fr;gap:8px}.feat-card{display:flex;align-items:center;gap:12px;padding:14px;border-radius:10px;cursor:pointer;background:var(--bg);border:1.5px solid var(--border);transition:all .2s;min-height:48px;-webkit-user-select:none;user-select:none}.feat-card:hover{border-color:var(--blue);background:var(--blue-light)}.feat-card.sel{border-color:var(--blue);background:var(--blue-light);box-shadow:0 0 0 1px var(--blue)}.feat-check{width:22px;height:22px;border-radius:6px;border:2px solid #CBD5E1;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}.feat-check.checked{background:var(--blue);border-color:var(--blue)}.feat-label{font-size:.9rem;color:var(--text2);font-weight:500}.sticky-footer{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.94);backdrop-filter:blur(16px);border-top:1px solid var(--border);z-index:100;padding:.85rem 1.25rem;box-shadow:0 -4px 12px rgba(0,0,0,.04)}.sticky-inner{max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem}.sticky-info{display:flex;align-items:center;gap:10px}.sticky-count{font-size:1.5rem;font-weight:800;font-family:'Outfit';color:var(--blue);background:var(--blue-light);width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center}.sticky-text{font-size:.85rem;color:var(--muted);font-weight:500}.sticky-btn{width:auto!important;white-space:nowrap;padding:.75rem 1.5rem;font-size:.9rem}
.cta-banner{padding:3.5rem 1.25rem;background:var(--blue);text-align:center}.cta-title{font-family:'Outfit';font-size:1.5rem;font-weight:800;margin-bottom:.6rem;color:#fff}.cta-sub{color:#BFDBFE;font-size:.9rem;margin-bottom:1.75rem;line-height:1.6}.cta-btn{background:#fff;color:var(--blue);border:none;padding:.85rem 2rem;border-radius:12px;font-weight:700;font-size:.95rem;cursor:pointer;font-family:'DM Sans';box-shadow:0 4px 20px rgba(0,0,0,.15);min-height:52px;width:100%;max-width:320px}.cta-btn:hover{transform:translateY(-2px)}.cta-btn:active{transform:scale(.97)}
.footer{padding:2rem 1.25rem;border-top:1px solid var(--border);background:var(--surface);text-align:center}.footer-tag{color:var(--muted);font-size:.82rem;margin-top:8px}.footer-copy{color:#94A3B8;margin-top:16px;font-size:.75rem;border-top:1px solid var(--border);padding-top:16px}
.success-wrap{position:fixed;inset:0;background:rgba(248,250,252,.96);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px}.success-card{background:var(--card);border-radius:20px;padding:2.5rem 1.5rem;max-width:420px;width:100%;text-align:center;border:1px solid var(--border);box-shadow:0 20px 60px rgba(0,0,0,.08)}.success-check{width:60px;height:60px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem}.success-title{font-family:'Outfit';font-size:1.5rem;font-weight:700;margin-bottom:10px}.success-text{color:var(--muted);font-size:.95rem;line-height:1.6;margin-bottom:24px}
/* HOSTING QUESTIONNAIRE */
.hosting-card{border:2px solid rgba(26,86,219,.12);background:linear-gradient(180deg,#FAFBFF,#fff)}
.hosting-q{margin-bottom:1.5rem}
.hosting-q-label{display:block;font-family:'Outfit';font-size:.92rem;font-weight:600;color:var(--text);margin-bottom:.75rem}
.hosting-opts{display:grid;grid-template-columns:1fr;gap:8px}
.hosting-opt{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;border:1.5px solid var(--border);background:var(--surface);cursor:pointer;transition:all .2s;min-height:48px;position:relative;-webkit-user-select:none;user-select:none}
.hosting-opt:hover{border-color:rgba(26,86,219,.3);background:rgba(26,86,219,.03)}
.hosting-opt.sel{border-color:var(--blue);background:var(--blue-light);box-shadow:0 0 0 1px var(--blue)}
.hosting-emoji{font-size:1.2rem;flex-shrink:0;width:28px;text-align:center}
.hosting-opt-text{font-size:.88rem;color:var(--text2);font-weight:500;flex:1}
.hosting-opt.sel .hosting-opt-text{color:var(--text);font-weight:600}
.hosting-opt-check{width:22px;height:22px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.hosting-result{margin-top:1.5rem;padding:1.5rem;border-radius:16px;background:linear-gradient(135deg,rgba(26,86,219,.04),rgba(99,102,241,.04));border:1.5px solid rgba(26,86,219,.15);animation:fadeUp .5s ease}
.hosting-result-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px}
.hosting-result-badge{color:#fff;padding:.35rem 1rem;border-radius:100px;font-family:'Outfit';font-size:.8rem;font-weight:700;letter-spacing:.02em}
.hosting-result-price{display:flex;align-items:baseline;gap:2px}
.hosting-price-amount{font-family:'Outfit';font-size:2rem;font-weight:800;color:var(--blue)}
.hosting-price-period{font-size:.85rem;color:var(--muted);font-weight:500}
.hosting-result-desc{color:var(--text2);font-size:.88rem;line-height:1.6;margin-bottom:1.25rem}
.hosting-result-includes{padding-top:1rem;border-top:1px solid rgba(26,86,219,.1)}
.hosting-inc-title{font-family:'Outfit';font-size:.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem}
.hosting-inc-item{display:flex;align-items:center;gap:10px;font-size:.85rem;color:var(--text2);padding:.4rem 0;font-weight:500}
.hosting-inc-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px);filter:blur(3px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@media(min-width:640px){.hero-title{font-size:2.8rem}.hero-ctas{flex-direction:row}.btn-primary,.btn-ghost{width:auto}.hero-values{flex-direction:row;justify-content:center;gap:2rem}.serv-grid{grid-template-columns:repeat(2,1fr)}.section-title{font-size:2.2rem}.form-grid{grid-template-columns:1fr 1fr;gap:14px}.feat-grid{grid-template-columns:repeat(2,1fr);gap:10px}.cd-title{font-size:1.8rem}.cd-box{min-width:80px;padding:14px 18px}.cd-digit{font-size:2.2rem}.steps-grid{grid-template-columns:repeat(2,1fr)}.step-line{display:none}.scroll-section{height:75rem}.hosting-opts{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.nav-inner{padding:.85rem 1.5rem}.nav-links{display:flex!important;flex-direction:row;position:static;background:none;border:none;padding:0;gap:0;box-shadow:none}.nav-link{padding:.4rem .8rem;font-size:.88rem}.nav-cta{width:auto;margin-top:0}.hamburger{display:none!important}.hero{padding:10rem 2rem 6rem}.hero-title{font-size:3.8rem}.section{padding:6rem 2rem}.section-title{font-size:2.6rem}.serv-grid{grid-template-columns:repeat(3,1fr)}.serv-card{padding:26px;flex-direction:column}.scroll-section{height:80rem}.tablet{border-width:5px;padding:8px;border-radius:28px}.tablet-screen{border-radius:20px}.steps-grid{grid-template-columns:repeat(4,1fr)}.builder-card{padding:28px}.builder-card-title{font-size:1.15rem}.feat-grid{grid-template-columns:repeat(3,1fr)}.sticky-btn{padding:.85rem 2rem!important;font-size:1rem!important}.cta-banner{padding:5rem 2rem}.cta-title{font-size:2rem}.cta-btn{width:auto}.countdown-inner{padding:3.5rem 2.5rem}.cd-title{font-size:2.2rem}}
`;
