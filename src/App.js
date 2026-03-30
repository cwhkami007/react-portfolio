import React, { useState, useEffect } from 'react';
import {
  CLOUD,
  MEDIA,
  COLLECTIONS,
  DISPLAY,
  JOURNALISM,
  JOURNALISM_PUBLICATIONS,
  PODCASTS,
} from './media';
import Squares from './components/Squares/Squares';
import Threads from './components/Threads/Threads';
import TargetCursor from './components/TargetCursor/TargetCursor';
import TiltedCard from './components/TiltedCard/TiltedCard';
import MetallicPaint from './components/MetallicPaint/MetallicPaint';

//info
const MY_NAME = 'Christian Hui';
const MY_TAGLINE = 'Audio · Video · Graphic Design · Mograph · and more';
const MY_BIO = 'I create what I love.';
const MY_EMAIL = 'christianwhui@gmail.com';
const MY_IG = 'https://instagram.com/doublebangdesigns';
const MY_LINKEDIN = 'https://linkedin.com/in/christian-w-hui';
const MY_ACCENT = 'FFFFFF';
const MY_HERO_ID = 'IMG_6955_gy5bkd';
const BG_VIDEO = 'p5uibackground_axdi1v';
const LOGO_ID = 'dblogowhite_aozkmg';

function img(id, w = 900) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_${w},q_80,c_fill/${id}`;
}

function imgPng(id, w = 800) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_${w},q_80/${id}`;
}

function vid(id) {
  const fileName = id.includes('.') ? id : `${id}.mp4`;
  return `https://res.cloudinary.com/${CLOUD}/video/upload/q_auto,vc_h264/${fileName}`;
}

function buildItems(albumId) {
  return (MEDIA[albumId] || []).map((entry, i) => {
    const isVideo =
      entry.type === 'video' ||
      entry.id.includes('logotransition') ||
      entry.id.match(/\.(mp4|webm|mov)$/i);
    return {
      _id: `${albumId}-${i}-${entry.id}`,
      title: entry.title || entry.id,
      type: isVideo ? 'video' : entry.type || 'image',
      collection: entry.collection || '',
      year: entry.year || '',
      tags: entry.tags || [],
      cloudId: entry.id,
    };
  });
}

function getPodcastShows() {
  const shows = [
    ...new Set((PODCASTS || []).map((p) => p.show).filter(Boolean)),
  ];
  return shows;
}

function getJournalismPubs() {
  const pubs = [
    ...new Set((JOURNALISM || []).map((a) => a.publication).filter(Boolean)),
  ];
  return ['All', ...pubs];
}

const ALBUM_IDS = [
  'graphics',
  'photo',
  'mograph',
  'video',
  'journalism',
  'podcasts',
];
const ALBUM_LABELS = {
  graphics: 'Graphics',
  photo: 'Photo',
  mograph: 'Mograph',
  video: 'Video / Edits',
  journalism: 'Journalism',
  podcasts: 'Podcasts',
};

// ── STYLES ───────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --a:#FFFFFF; --bg:#080808; --bg2:#111;
    --fg:#f0ece4; --gray:#555; --line:#1c1c1c;
    --F:'Bebas Neue',sans-serif; --B:'DM Sans',sans-serif;
  }
  html{scroll-behavior:smooth;}
  body{background:var(--bg);color:var(--fg);font-family:var(--B);overflow-x:hidden;}
  ::selection{background:var(--a);color:#000;}
  button{font-family:var(--B);cursor:pointer;}

  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:18px 40px;border-bottom:1px solid var(--line);backdrop-filter:blur(16px);background:rgba(8,8,8,.9);}
  .nav-logo{font-family:var(--F);font-size:20px;letter-spacing:3px;color:var(--fg);text-decoration:none;}
  .nav-links{display:flex;gap:28px;list-style:none;}
  .nav-links a{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gray);text-decoration:none;transition:color .2s;}
  .nav-links a:hover{color:var(--a);}

  .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:end;padding:100px 40px 60px;position:relative;overflow:hidden;}
  .hero-bg-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;}
  .hero-bg-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.62);z-index:1;pointer-events:none;}
  .hero-bg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%);z-index:2;pointer-events:none;}
  .hero-left{position:relative;z-index:3;}
  .hero-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--a);margin-bottom:20px;}
  .hero-name{font-family:var(--F);font-size:clamp(64px,10vw,156px);line-height:.88;color:var(--fg);margin-bottom:28px;}
  .hero-name em{color:var(--a);font-style:normal;}
  .hero-bio{font-size:15px;font-weight:300;color:#aaa;max-width:400px;line-height:1.7;}
  .hero-cta{margin-top:36px;display:flex;gap:16px;}
  .hero-btn{font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:12px 28px;border:1px solid var(--fg);color:var(--fg);background:none;text-decoration:none;display:inline-block;transition:all .2s;}
  .hero-btn:hover,.hero-btn.accent{background:var(--a);border-color:var(--a);color:#000;}
  .hero-right{position:relative;z-index:3;display:flex;justify-content:flex-end;align-items:flex-end;}

  .photo-overlay{position:absolute;bottom:0;left:0;right:0;padding:20px 16px 16px;background:linear-gradient(transparent,rgba(0,0,0,.7));pointer-events:none;display:flex;align-items:flex-end;}
  .photo-overlay-name{font-family:var(--F);font-size:28px;color:var(--fg);}

  .section-head{padding:60px 40px 0;display:flex;align-items:flex-end;justify-content:space-between;border-top:1px solid var(--line);}
  .section-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--a);margin-bottom:8px;}
  .section-title{font-family:var(--F);font-size:clamp(36px,5vw,64px);color:var(--fg);line-height:.9;}
  .mode-toggle{display:flex;gap:4px;}
  .mode-btn{background:none;border:1px solid var(--line);color:var(--gray);width:36px;height:36px;display:flex;align-items:center;justify-content:center;transition:all .2s;border-radius:2px;font-size:15px;}
  .mode-btn:hover{border-color:var(--fg);color:var(--fg);}
  .mode-btn.on{background:var(--a);border-color:var(--a);color:#000;}

  .album-tabs{display:flex;padding:32px 40px 0;flex-wrap:wrap;}
  .album-tab{background:none;border:1px solid var(--line);border-right:none;color:var(--gray);font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:10px 22px;transition:all .2s;}
  .album-tab:last-child{border-right:1px solid var(--line);}
  .album-tab:hover{color:var(--fg);border-color:#333;}
  .album-tab.on{background:var(--a);border-color:var(--a);color:#000;}
  .col-tabs{display:flex;gap:4px;padding:20px 40px 0;flex-wrap:wrap;}
  .col-tab{background:none;border:1px solid transparent;color:var(--gray);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;transition:all .2s;border-radius:1px;}
  .col-tab:hover{color:var(--fg);}
  .col-tab.on{border-color:var(--a);color:var(--a);}

  .disp-feat{padding:24px 40px 40px;}
  .feat-layout{display:grid;grid-template-columns:2fr 1fr;gap:2px;}
  .feat-main{aspect-ratio:16/9;position:relative;overflow:hidden;cursor:none;background:var(--bg2);}
  .feat-side{display:flex;flex-direction:column;gap:2px;}
  .feat-thumb{flex:1;min-height:80px;position:relative;overflow:hidden;cursor:none;background:var(--bg2);}

  .view-all-container { display: flex; justify-content: center; padding-bottom: 80px; }
  .view-all-btn { background: none; border: 1px solid var(--line); color: var(--gray); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 32px; transition: all .3s; }
  .view-all-btn:hover { border-color: var(--fg); color: var(--fg); }

  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2px;padding:24px 40px 80px;}
  .strip{display:flex;gap:2px;overflow-x:auto;padding:0 40px 80px;scrollbar-width:none;}
  .strip::-webkit-scrollbar{display:none;}
  .strip-item{flex:0 0 540px;aspect-ratio:16/9;position:relative;overflow:hidden;cursor:none;}

  .card{position:relative;overflow:hidden;aspect-ratio:4/3;cursor:none;background:var(--bg2);}
  .card img,.card video,.card iframe{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease,filter .4s;filter:brightness(.8);}
  .card:hover img,.card:hover video{transform:scale(1.05);filter:brightness(1);}
  .card-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 55%);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:18px;pointer-events:none;}
  .card:hover .card-over{opacity:1;}
  .card-col{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:4px;}
  .card-title{font-family:var(--F);font-size:20px;color:var(--fg);text-transform:capitalize;}
  .card-tags{margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;}
  .tag{font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:2px 6px;border:1px solid #444;color:#777;border-radius:1px;}

  /* ── VIDEO / EDITS CARD ── */
  .video-card{position:relative;overflow:hidden;aspect-ratio:16/9;cursor:none;background:var(--bg2);}
  .video-card video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease;}
  .video-card:hover video{transform:scale(1.03);}
  .video-card .card-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 55%);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:18px;pointer-events:none;}
  .video-card:hover .card-over{opacity:1;}
  .video-card .sound-badge{position:absolute;top:12px;right:12px;background:rgba(0,0,0,.6);border:1px solid #333;color:#888;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 8px;border-radius:2px;pointer-events:none;}

  .cursor-target { cursor: none; }

  .lb{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.97);display:flex;align-items:center;justify-content:center;padding:20px;}
  .lb-inner{display:flex;flex-direction:column;gap:14px;max-width:90vw;}
  .lb-inner img{max-width:90vw;max-height:76vh;object-fit:contain;display:block;}
  .lb-inner video{max-width:90vw;max-height:76vh;display:block;}
  .lb-info{display:flex;justify-content:space-between;align-items:center;}
  .lb-title{font-family:var(--F);font-size:26px;color:var(--fg);}
  .lb-x{position:fixed;top:20px;right:28px;background:none;border:1px solid var(--line);color:var(--fg);font-size:18px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:2px;}
  .lb-nav{position:fixed;top:50%;transform:translateY(-50%);background:none;border:1px solid var(--line);color:var(--fg);font-size:18px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:2px;}
  .lb-prev{left:20px;} .lb-next{right:20px;}

  /* ── JOURNALISM ── */
  .journalism-section{padding:24px 40px 80px;}
  .journalism-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:2px;}
  .j-card{background:var(--bg2);border:1px solid var(--line);padding:28px 28px 24px;display:flex;flex-direction:column;gap:12px;transition:border-color .25s,background .25s;text-decoration:none;color:inherit;position:relative;overflow:hidden;}
  .j-card:hover{border-color:#333;background:#141414;}
  .j-card-pub{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
  .j-pub-logo{height:28px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:.7;}
  .j-pub-name{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gray);}
  .j-card-title{font-family:var(--F);font-size:22px;color:var(--fg);line-height:1.1;}
  .j-card-desc{font-size:13px;font-weight:300;color:#666;line-height:1.7;}
  .j-card-date{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444;margin-top:auto;}
  .j-card-arrow{position:absolute;bottom:24px;right:24px;font-size:18px;color:#333;transition:color .2s,transform .2s;}
  .j-card:hover .j-card-arrow{color:var(--a);transform:translate(3px,-3px);}

  /* ── PODCASTS ── */
  .podcasts-section{padding:24px 40px 80px;}
  .podcast-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(480px,1fr));gap:24px;}
  .podcast-card{background:var(--bg2);border:1px solid var(--line);padding:24px 24px 20px;display:flex;flex-direction:column;gap:14px;transition:border-color .25s;}
  .podcast-card:hover{border-color:#333;}
  .podcast-card-header{display:flex;flex-direction:column;gap:6px;}
  .podcast-show{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--a);}
  .podcast-title{font-family:var(--F);font-size:20px;color:var(--fg);}
  .podcast-desc{font-size:13px;font-weight:300;color:#666;line-height:1.6;}
  .podcast-date{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444;}
  .podcast-embed{width:100%;border:none;border-radius:2px;background:#0a0a0a;}
  .podcast-empty{padding:48px 0;color:#333;font-size:13px;letter-spacing:1px;}

  .about{padding: 80px 40px; border-top: 1px solid var(--line); display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; position: relative; overflow: hidden;}
  .about-squares{position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.06; pointer-events: none; z-index: 0;}
  .about-content{position: relative; z-index: 1;}
  .about-head{font-family:var(--F);font-size:clamp(40px,5vw,68px);line-height:.92;color:var(--fg);margin:12px 0 20px;}
  .about-body{font-size:14px;font-weight:300;color:#888;line-height:1.9;max-width:500px;}
  .stats{display:flex;flex-direction:column;gap:28px;padding-top:12px;position:relative;z-index:1;}
  .stat{border-left:2px solid var(--a);padding-left:16px;}
  .stat-n{font-family:var(--F);font-size:48px;line-height:1;color:var(--fg);}
  .stat-l{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gray);margin-top:2px;}

  .contact{padding: 80px 40px 100px; border-top: 1px solid var(--line); text-align: center; position: relative; overflow: hidden; min-height: 600px; display: flex; align-items: center; justify-content: center;}
  .contact-content{position: relative; z-index: 1; width: 100%;}
  .contact-head{font-family:var(--F);font-size:clamp(48px,8vw,112px);line-height:.88;color:var(--fg);margin-bottom:48px;}
  .contact-head em{color:var(--a);font-style:normal;}
  .contact-logo-wrap{width: min(400px, 80vw); height: 250px; margin: 0 auto 48px;}

  .contact-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin-top: 20px;
  }
  .contact-link {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--fg);
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 8px 0;
    border-bottom: 1px solid transparent;
  }
  .contact-link:hover {
    color: var(--a);
    border-bottom: 1px solid var(--a);
  }

  .footer{padding:20px 40px;border-top:1px solid var(--line);display:flex;justify-content:space-between;}
  .footer span{font-size:10px;color:var(--gray);letter-spacing:1px;}

  @media(max-width:900px){
    .hero{grid-template-columns:1fr;padding-top:90px;}
    .hero-right{display:none;}
    .about{grid-template-columns:1fr;gap:40px;}
    .feat-layout{grid-template-columns:1fr;}
    .contact-logo-wrap{height:160px;}
    .contact-links { gap: 20px; flex-direction: column; }
    .podcast-grid{grid-template-columns:1fr;}
    .journalism-grid{grid-template-columns:1fr;}
  }
`;

// ── COMPONENTS ───────────────────────────────────────────────
function MediaEl({ item }) {
  if (item.type === 'video')
    return (
      <video
        src={vid(item.cloudId)}
        muted
        loop
        playsInline
        autoPlay
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  if (item.type === 'vimeo')
    return (
      <iframe
        src={`https://player.vimeo.com/video/${item.cloudId}?autoplay=1&muted=1&loop=1&background=1`}
        allow="autoplay"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    );
  return <img src={img(item.cloudId)} alt={item.title} loading="lazy" />;
}

// Video card for Video/Edits — 16:9, muted preview, opens lightbox with sound
function VideoEditCard({ item, onClick }) {
  return (
    <div
      className="video-card cursor-target"
      onClick={() => onClick && onClick(item)}
    >
      <video
        src={vid(item.cloudId)}
        muted
        loop
        playsInline
        autoPlay
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <span className="sound-badge">▶ Play</span>
      <div className="card-over">
        <div>
          <div className="card-col">{item.collection || item.year}</div>
          <div className="card-title">{item.title}</div>
          <div className="card-tags">
            {item.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ item, onClick, className = 'card' }) {
  return (
    <div
      className={`${className} cursor-target`}
      onClick={() => onClick && onClick(item)}
    >
      <MediaEl item={item} />
      <div className="card-over">
        <div>
          <div className="card-col">{item.collection || item.year}</div>
          <div className="card-title">{item.title}</div>
          <div className="card-tags">
            {item.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedDisplay({ items, onOpen }) {
  const [fi, setFi] = useState(0);
  const main = items[fi];
  const thumbs = items.filter((_, i) => i !== fi).slice(0, 3);
  return (
    <div className="disp-feat">
      <div className="feat-layout">
        <div
          className="feat-main card cursor-target"
          onClick={() => main && onOpen(main)}
        >
          {main && (
            <>
              <MediaEl item={main} />
              <div className="card-over" style={{ opacity: 1 }}>
                <div>
                  <div className="card-title" style={{ fontSize: '28px' }}>
                    {main.title}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="feat-side">
          {thumbs.map((item) => (
            <div
              key={item._id}
              className="feat-thumb card cursor-target"
              onClick={() => setFi(items.indexOf(item))}
            >
              <MediaEl item={item} />
              <div className="card-over">
                <div>
                  <div className="card-title" style={{ fontSize: '15px' }}>
                    {item.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── JOURNALISM SECTION ────────────────────────────────────────
function JournalismSection() {
  const pubs = getJournalismPubs();
  const [activePub, setActivePub] = useState('All');

  const filtered =
    activePub === 'All'
      ? JOURNALISM || []
      : (JOURNALISM || []).filter((a) => a.publication === activePub);

  return (
    <>
      <div className="col-tabs">
        {pubs.map((p) => (
          <button
            key={p}
            className={`col-tab cursor-target${activePub === p ? ' on' : ''}`}
            onClick={() => setActivePub(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="journalism-section">
        {filtered.length === 0 ? (
          <div
            style={{ color: '#333', fontSize: '13px', letterSpacing: '1px' }}
          >
            No articles yet — add entries to the JOURNALISM array in media.js
          </div>
        ) : (
          <div className="journalism-grid">
            {filtered.map((article, i) => {
              const pubInfo =
                (JOURNALISM_PUBLICATIONS || {})[article.publication] || {};
              return (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="j-card cursor-target"
                >
                  <div className="j-card-pub">
                    {pubInfo.logoId ? (
                      <img
                        src={imgPng(pubInfo.logoId, 400)}
                        alt={article.publication}
                        className="j-pub-logo"
                      />
                    ) : (
                      <span
                        className="j-pub-name"
                        style={{ color: pubInfo.color || 'var(--gray)' }}
                      >
                        {article.publication}
                      </span>
                    )}
                  </div>
                  <div className="j-card-title">{article.title}</div>
                  {article.description && (
                    <div className="j-card-desc">{article.description}</div>
                  )}
                  <div className="j-card-date">{article.date}</div>
                  <span className="j-card-arrow">↗</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ── PODCASTS SECTION ──────────────────────────────────────────
function PodcastsSection() {
  const shows = getPodcastShows();
  const [activeShow, setActiveShow] = useState('All');

  const filtered =
    activeShow === 'All'
      ? PODCASTS || []
      : (PODCASTS || []).filter((p) => p.show === activeShow);

  return (
    <>
      {shows.length > 0 && (
        <div className="col-tabs">
          {['All', ...shows].map((s) => (
            <button
              key={s}
              className={`col-tab cursor-target${
                activeShow === s ? ' on' : ''
              }`}
              onClick={() => setActiveShow(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="podcasts-section">
        {filtered.length === 0 ? (
          <div className="podcast-empty">
            No episodes yet — add entries to the PODCASTS array in media.js
          </div>
        ) : (
          <div className="podcast-grid">
            {filtered.map((ep, i) => (
              <div key={i} className="podcast-card">
                <div className="podcast-card-header">
                  <span className="podcast-show">{ep.show}</span>
                  <div className="podcast-title">{ep.title}</div>
                  {ep.description && (
                    <div className="podcast-desc">{ep.description}</div>
                  )}
                  <div className="podcast-date">{ep.date}</div>
                </div>
                <iframe
                  className="podcast-embed"
                  src={ep.embedUrl}
                  height="122"
                  scrolling="no"
                  allow="autoplay"
                  title={ep.title}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function Portfolio() {
  const [activeAlbum, setActiveAlbum] = useState('graphics');
  const [activeCol, setActiveCol] = useState(COLLECTIONS.graphics[0]);
  const [modeOvr, setModeOvr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isSpecial = activeAlbum === 'journalism' || activeAlbum === 'podcasts';
  const isVideo = activeAlbum === 'video';
  const mode =
    isSpecial || isVideo ? null : modeOvr || DISPLAY[activeAlbum] || 'featured';

  const allItems = isSpecial ? [] : buildItems(activeAlbum);
  const items = isSpecial
    ? []
    : allItems.filter((i) => i.collection === activeCol);

  const switchAlbum = (id) => {
    setActiveAlbum(id);
    if (COLLECTIONS[id] && COLLECTIONS[id].length > 0) {
      setActiveCol(COLLECTIONS[id][0]);
    }
    setModeOvr(null);
  };

  const navLb = (dir) => {
    const idx = items.findIndex((i) => i._id === lightbox._id);
    if (idx === -1) return;
    setLightbox(items[(idx + dir + items.length) % items.length]);
  };

  return (
    <>
      <style>{css}</style>

      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={false}
        hoverDuration={0.2}
        parallaxOn={true}
      />

      <nav className="nav">
        <a href="#" className="nav-logo">
          {MY_NAME}
        </a>
        <ul className="nav-links">
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <video
          className="hero-bg-video"
          src={vid(BG_VIDEO)}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-bg-overlay" />
        <div className="hero-bg-vignette" />
        <div className="hero-left">
          <p className="hero-eyebrow">{MY_TAGLINE}</p>
          <h1 className="hero-name">
            <span style={{ display: 'block' }}>CHRISTIAN</span>
            <span style={{ display: 'block' }}>
              <em>HUI</em>
            </span>
          </h1>
          <p className="hero-bio">{MY_BIO}</p>
          <div className="hero-cta">
            <a href="#work" className="hero-btn accent cursor-target">
              View Work
            </a>
            <a href="#contact" className="hero-btn cursor-target">
              Contact
            </a>
          </div>
        </div>
        <div className="hero-right">
          <TiltedCard
            imageSrc={img(MY_HERO_ID, 1200)}
            altText={MY_NAME}
            captionText={MY_NAME}
            containerHeight="min(500px, 50vw)"
            containerWidth="min(380px, 38vw)"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div
                className="photo-overlay"
                style={{ width: '100%', height: '100%' }}
              >
                <div className="photo-overlay-name">{MY_NAME}</div>
              </div>
            }
          />
        </div>
      </section>

      {/* ── WORK SECTION ── */}
      <div id="work">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">Selected Work</div>
            <div className="section-title">{ALBUM_LABELS[activeAlbum]}</div>
          </div>
          {/* Mode toggle only for grid-based media albums */}
          {!isSpecial && !isVideo && (
            <div className="mode-toggle">
              {Object.entries({ grid: '⊞', featured: '⊡', strip: '⊟' }).map(
                ([m, icon]) => (
                  <button
                    key={m}
                    className={`mode-btn cursor-target${
                      mode === m ? ' on' : ''
                    }`}
                    onClick={() => setModeOvr(m)}
                  >
                    {icon}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Album tabs */}
        <div className="album-tabs">
          {ALBUM_IDS.map((id) => (
            <button
              key={id}
              className={`album-tab cursor-target${
                activeAlbum === id ? ' on' : ''
              }`}
              onClick={() => switchAlbum(id)}
            >
              {ALBUM_LABELS[id]}
            </button>
          ))}
        </div>

        {/* ── JOURNALISM ── */}
        {activeAlbum === 'journalism' && <JournalismSection />}

        {/* ── PODCASTS ── */}
        {activeAlbum === 'podcasts' && <PodcastsSection />}

        {/* ── VIDEO / EDITS ── */}
        {isVideo && (
          <>
            <div className="col-tabs">
              {(COLLECTIONS.video || []).map((c) => (
                <button
                  key={c}
                  className={`col-tab cursor-target${
                    activeCol === c ? ' on' : ''
                  }`}
                  onClick={() => setActiveCol(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {items.length === 0 ? (
              <div
                style={{
                  padding: '48px 40px',
                  color: '#333',
                  fontSize: '13px',
                  letterSpacing: '1px',
                }}
              >
                No videos yet — add entries to the video array in media.js
              </div>
            ) : (
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill,minmax(400px,1fr))',
                }}
              >
                {items.map((item) => (
                  <VideoEditCard
                    key={item._id}
                    item={item}
                    onClick={setLightbox}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STANDARD MEDIA ALBUMS: graphics, photo, mograph ── */}
        {!isSpecial && !isVideo && (
          <>
            <div className="col-tabs">
              {(COLLECTIONS[activeAlbum] || []).map((c) => (
                <button
                  key={c}
                  className={`col-tab cursor-target${
                    activeCol === c ? ' on' : ''
                  }`}
                  onClick={() => setActiveCol(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {items.length === 0 ? (
              <div style={{ padding: '48px 40px', color: '#333' }}>
                Empty collection
              </div>
            ) : mode === 'featured' ? (
              <>
                <FeaturedDisplay items={items} onOpen={setLightbox} />
                <div className="view-all-container">
                  <button
                    className="view-all-btn cursor-target"
                    onClick={() => setModeOvr('grid')}
                  >
                    View Full Collection / Grid
                  </button>
                </div>
              </>
            ) : mode === 'strip' ? (
              <div className="strip">
                {items.map((item) => (
                  <Card
                    key={item._id}
                    item={item}
                    onClick={setLightbox}
                    className="strip-item card"
                  />
                ))}
              </div>
            ) : (
              <div className="grid">
                {items.map((item) => (
                  <Card key={item._id} item={item} onClick={setLightbox} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lb" onClick={() => setLightbox(null)}>
          <button className="lb-x cursor-target">✕</button>
          <button
            className="lb-nav lb-prev cursor-target"
            onClick={(e) => {
              e.stopPropagation();
              navLb(-1);
            }}
          >
            ←
          </button>
          <button
            className="lb-nav lb-next cursor-target"
            onClick={(e) => {
              e.stopPropagation();
              navLb(1);
            }}
          >
            →
          </button>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <video
                src={vid(lightbox.cloudId)}
                controls
                autoPlay
                // muted only for mograph; Video/Edits plays with sound
                muted={activeAlbum === 'mograph'}
                style={{ maxWidth: '90vw', maxHeight: '76vh' }}
              />
            ) : (
              <img src={img(lightbox.cloudId, 1600)} alt={lightbox.title} />
            )}
            <div className="lb-info">
              <div>
                <div className="lb-title">{lightbox.title}</div>
                <div className="lb-sub">
                  {lightbox.year} · {lightbox.collection}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="about" className="about">
        <div className="about-squares">
          {mounted && (
            <Squares
              speed={0.5}
              squareSize={40}
              direction="diagonal"
              borderColor="#ffffff"
              hoverFillColor="#222"
            />
          )}
        </div>
        <div className="about-content">
          <div className="section-eyebrow">About</div>
          <h2 className="about-head">
            For Love
            <br />
            of the
            <br />
            Game
          </h2>
          <p className="about-body">
            I am a multi-discipline creative that loves the culture and game of
            basketball.
          </p>
          <p className="about-body">
            My work takes influence from the things I love, from popular media,
            nerd culture, personal heritage, and more. In my time in media, I
            have seen what it takes to curate and deliver a great story, from
            hitting the shutter on the sidelines to every step of the creative
            process. This has generated great exposure for the numerous sports
            organizations I have served, including Rucker Park Streetball
            (@ruckerparkstreetball), AMSG FC (@amsgfc), the New Jersey Jackals
            (@jackalsbaseball),and Seton Hall Sports Media (@thesetonian,
            @wsousports, @hallsportsmedia).
          </p>
          <p className="about-body">
            <br />
            Outside of sports media, I enjoy playing the drums for my band,
            developing video games, producing music, watching live shows, and
            nerding out on my favorite franchises.
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-n">4+</div>
            <div className="stat-l">Years Experience</div>
          </div>
          <div className="stat">
            <div className="stat-n">120+</div>
            <div className="stat-l">Assets Delivered</div>
          </div>
          <div className="stat">
            <div className="stat-n">6</div>
            <div className="stat-l">Disciplines</div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            zIndex: 0,
          }}
        >
          <Threads amplitude={1} distance={0} enableMouseInteraction />
        </div>
        <div className="contact-content">
          <h2 className="contact-head">
            Let's <em>Work</em> Together
          </h2>
          <div className="contact-logo-wrap">
            <MetallicPaint
              imageSrc={imgPng(LOGO_ID, 800)}
              seed={42}
              scale={4}
              patternSharpness={1}
              noiseScale={0.5}
              speed={0.3}
              liquid={0.75}
              mouseAnimation={false}
              brightness={2}
              contrast={0.5}
              refraction={0.01}
              blur={0.015}
              chromaticSpread={2}
              fresnel={1}
              angle={0}
              waveAmplitude={1}
              distortion={1}
              contour={0.2}
              lightColor="#ffffff"
              darkColor="#000000"
              tintColor="#feb3ff"
            />
          </div>
          <div className="contact-links">
            <a
              href={`mailto:${MY_EMAIL}`}
              className="contact-link cursor-target"
            >
              Email
            </a>
            <a
              href={MY_IG}
              target="_blank"
              rel="noreferrer"
              className="contact-link cursor-target"
            >
              Instagram
            </a>
            <a
              href={MY_LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="contact-link cursor-target"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {MY_NAME}
        </span>
        <span>Built with React</span>
      </footer>
    </>
  );
}

