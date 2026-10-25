import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, AlertCircle, ArrowDown, ArrowRight, BarChart3, CheckCircle2, ChevronDown, CircleHelp, ClipboardCheck, Download, FileImage, Image as ImageIcon, Info, Layers3, LoaderCircle, Menu, RefreshCw, ScanLine, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, UploadCloud, WandSparkles, X } from 'lucide-react';

type Metrics = {
  laplacian_var: number; tenengrad: number; brightness_mean: number; brightness_std: number;
  dark_fraction: number; bright_fraction: number; contrast_p95_p5: number; colorfulness: number;
  entropy: number; width: number; height: number;
};
type Analysis = {
  filename: string;
  status: 'PASS_PROVISIONAL' | 'REVIEW';
  reasons: string[];
  metrics: Metrics;
  quality_estimate: { value: number | null; scale: string; source: string; available: boolean; message: string };
  disclaimer: string;
};
type Health = { status: string; model_loaded: boolean; model_error: string | null };
type View = 'workspace' | 'about';
const API = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const MAX_BYTES = 12 * 1024 * 1024;
const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const reasonLabel: Record<string, string> = {
  possible_blur: 'Ketajaman gambar berpotensi kurang',
  possibly_too_dark: 'Foto berpotensi terlalu gelap',
  possibly_too_bright: 'Foto berpotensi terlalu terang',
};
const nf = (n: number, digits = 1) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits }).format(n);

function StatItem({ title, value, hint, tone }: { title: string; value: string; hint: string; tone?: 'blue' | 'amber' }) {
  return <div className="stat-item"><div className="stat-top"><span>{title}</span><span className={`mini-signal ${tone || ''}`} /></div><strong>{value}</strong><small>{hint}</small></div>;
}
function Meter({ value, max = 100, theme = 'blue' }: { value: number; max?: number; theme?: 'blue' | 'amber' | 'mint' }) {
  return <div className="meter" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><span className={`meter-fill ${theme}`} style={{ width: `${Math.min(100, Math.max(0, value / max * 100))}%` }} /></div>;
}
function downloadJson(result: Analysis) {
  const blob = new Blob([JSON.stringify({ ...result, exported_at: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `productphoto-report-${Date.now()}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [view, setView] = useState<View>('workspace');
  const [navOpen, setNavOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [checking, setChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(`${API}/api/v1/health`, { signal: AbortSignal.timeout(6500) });
      if (!response.ok) throw new Error('API tidak mengembalikan respons sehat.');
      const data = await response.json() as Health;
      setHealth(data);
    } catch { setHealth(null); }
    finally { setChecking(false); }
  }, []);
  useEffect(() => { void checkHealth(); }, [checkHealth]);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => () => abortRef.current?.abort(), []);

  function selectFile(input: File | null | undefined) {
    if (!input) return;
    if (!accepted.includes(input.type)) { setError('Gunakan JPG, PNG, WEBP, atau BMP.'); return; }
    if (input.size > MAX_BYTES) { setError('Ukuran foto maksimal 12 MB.'); return; }
    if (input.size === 0) { setError('File kosong tidak bisa dianalisis.'); return; }
    abortRef.current?.abort(); setBusy(false); setFile(input); setResult(null); setError(null); setShowDetails(false);
  }
  function reset() { abortRef.current?.abort(); setBusy(false); setFile(null); setResult(null); setError(null); setShowDetails(false); if (fileInput.current) fileInput.current.value = ''; }
  async function analyze() {
    if (!file || busy) return;
    const controller = new AbortController(); abortRef.current = controller;
    setError(null); setBusy(true); setResult(null);
    try {
      const payload = new FormData(); payload.append('file', file);
      const response = await fetch(`${API}/api/v1/analyze`, { method: 'POST', body: payload, signal: controller.signal });
      if (!response.ok) {
        let message = `Analisis gagal (HTTP ${response.status}).`;
        try { const body: { detail?: string | Array<{ msg?: string }> } = await response.json(); if (typeof body.detail === 'string') message = body.detail; else if (Array.isArray(body.detail)) message = body.detail.map(x => x.msg).filter(Boolean).join('; ') || message; } catch { /* retain status text */ }
        throw new Error(message);
      }
      const data = await response.json() as Analysis;
      if (!data.metrics || !data.quality_estimate) throw new Error('Format respons API tidak sesuai.');
      setResult(data);
    } catch (exc) {
      if (!(exc instanceof DOMException && exc.name === 'AbortError')) setError(exc instanceof TypeError ? 'Tidak dapat menghubungi API. Pastikan FastAPI berjalan di port 8000.' : exc instanceof Error ? exc.message : 'Terjadi kesalahan.');
    } finally { if (abortRef.current === controller) { setBusy(false); abortRef.current = null; } }
  }
  const hasModel = health?.model_loaded === true;
  const isReady = health?.status === 'ok';
  const m = result?.metrics;
  const score = result?.quality_estimate.value;
  const review = result?.status === 'REVIEW';

  return <div className="app-shell">
    <aside className={`sidebar ${navOpen ? 'nav-open' : ''}`}>
      <div className="brand"><div className="brand-symbol"><ScanLine size={21} strokeWidth={2.2}/></div><div><div className="brand-name">ProductPhoto<span> QA</span></div><div className="brand-caption">INTELLIGENT PHOTO ANALYSIS</div></div></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav aria-label="Main navigation">
        <button className={`nav-item ${view === 'workspace' ? 'active' : ''}`} onClick={() => {setView('workspace');setNavOpen(false)}}><Layers3 size={18}/> Overview <span className="nav-arrow">›</span></button>
        <button className="nav-item" onClick={() => {setView('workspace');setNavOpen(false); document.getElementById('upload-section')?.scrollIntoView({behavior:'smooth'})}}><ScanLine size={18}/> Photo analysis </button>
        <button className="nav-item" onClick={() => {setView('workspace');setNavOpen(false); document.getElementById('results-section')?.scrollIntoView({behavior:'smooth'})}}><BarChart3 size={18}/> Analysis results</button>
      </nav>
      <div className="sidebar-label extra-space">RESOURCES</div>
      <nav><button className={`nav-item ${view === 'about' ? 'active' : ''}`} onClick={() => {setView('about');setNavOpen(false)}}><CircleHelp size={18}/> About this project</button></nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><div className="tip-icon"><Sparkles size={17}/></div><strong>Better product photos</strong><span>Understand image quality with measurable signals, not guesswork.</span></div>
        <div className="sidebar-foot">DAY 18 / 100 <span>·</span> BUILD 0.1.0</div>
      </div>
    </aside>
    {navOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setNavOpen(false)} />}
    <div className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="hamburger" aria-label="Toggle menu" onClick={() => setNavOpen(v=>!v)}><Menu size={20}/></button><span>Workspace</span><span className="crumb">/</span><strong>{view === 'workspace' ? 'Overview' : 'About'}</strong></div><div className="topbar-right"><div className={`connection-pill ${isReady ? 'online' : 'offline'}`}><span className="dot" />{isReady ? 'API Connected' : checking ? 'Checking API...' : 'API Offline'}</div><button className="icon-btn" title="Refresh API status" aria-label="Refresh API status" onClick={() => void checkHealth()}><RefreshCw size={17} className={checking ? 'spin' : ''}/></button><div className="avatar">P</div></div></header>
      <main className="content">
      {view === 'about' ? <section className="about-page fade-in"><div className="eyebrow">THE PROJECT</div><h1>Built for clearer product photography.</h1><p>ProductPhoto QA membantu memeriksa karakteristik ketajaman, pencahayaan, dan kontras foto produk. Backend menggunakan OpenCV serta model regresi kualitas yang dilatih pada KADID-10k.</p><div className="about-grid"><div className="white-card"><ShieldCheck size={25}/><h3>Evidence first</h3><p>Skor model adalah perkiraan kualitas pada domain distorsi sintetis KADID, bukan tingkat penerimaan marketplace.</p></div><div className="white-card"><Activity size={25}/><h3>Explainable signals</h3><p>Indikator berbasis aturan mengukur kemungkinan blur dan masalah pencahayaan. Ambang batas belum dikalibrasi.</p></div></div><button className="primary-btn" onClick={() => setView('workspace')}>Open analyzer <ArrowRight size={17}/></button></section> : <>
        <section className="intro fade-in"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR CREATIVE WORKSPACE</div><h1>Make every product<br/><span>photo count.</span></h1><p>Analyze image sharpness, lighting, and visual quality with an explainable AI-assisted workflow. Make better decisions, one photo at a time.</p><div className="intro-pills"><span><CheckCircle2 size={14}/> Instant diagnostics</span><span><ShieldCheck size={14}/> Transparent insights</span></div></div><div className="hero-visual" aria-hidden="true"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="hero-scan"><ScanLine size={52} strokeWidth={1.3}/></div><div className="floating-card floating-one"><span className="icon-circle blue"><Activity size={16}/></span><div><span>Sharpness</span><strong>Image signals</strong></div></div><div className="floating-card floating-two"><span className="icon-circle mint"><ShieldCheck size={16}/></span><div><span>Diagnostics</span><strong>Explainable</strong></div></div></div></section>
        <div className="section-heading"><div><span className="section-kicker">ANALYSIS STUDIO</span><h2>Photo quality workspace</h2><p>Upload a product image to start an analysis.</p></div><span className="step-label"><span>01</span> / 02</span></div>
        <section className="workspace-grid" id="upload-section"><div className="card upload-card"><div className="card-heading"><div className="title-with-icon"><span className="soft-icon"><ImageIcon size={19}/></span><div><h3>Input image</h3><p>Choose a product photo to analyze</p></div></div><span className="card-tag">IMAGE INPUT</span></div>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/bmp" hidden onChange={e => selectFile(e.target.files?.[0])}/>
        {!preview ? <div className={`drop-area ${dragging ? 'dragging' : ''}`} role="button" tabIndex={0} aria-label="Upload product photo" onKeyDown={e => {if (e.key==='Enter'||e.key===' ') fileInput.current?.click()}} onClick={() => fileInput.current?.click()} onDragOver={e => {e.preventDefault();setDragging(true)}} onDragLeave={e => {e.preventDefault();setDragging(false)}} onDrop={e => {e.preventDefault();setDragging(false); selectFile(e.dataTransfer.files[0])}}><div className="upload-graphic"><UploadCloud size={31}/></div><h4>Drop your image here</h4><p>or <strong>browse files</strong> from your device</p><div className="upload-formats">JPG <span/> PNG <span/> WEBP <span/> BMP</div><small>Maximum file size 12 MB</small></div> : <div className="preview-panel"><div className="preview-image-wrap"><img src={preview} alt="Selected product photo"/><button className="remove-preview" title="Remove image" onClick={reset}><X size={17}/></button></div><div className="file-row"><div className="file-icon"><FileImage size={19}/></div><div><strong title={file?.name}>{file?.name}</strong><span>{file ? `${nf(file.size / 1024 / 1024, 2)} MB · ${file.type.replace('image/', '').toUpperCase()}` : ''}</span></div><button className="icon-btn" aria-label="Choose another photo" title="Choose another photo" onClick={() => fileInput.current?.click()}><RefreshCw size={17}/></button></div></div>}
        <div className="upload-actions"><button className="primary-btn action-btn" disabled={!file || busy} onClick={() => void analyze()}>{busy ? <LoaderCircle className="spin" size={18}/> : <WandSparkles size={18}/>} {busy ? 'Analyzing image...' : 'Analyze photo'} {!busy && <ArrowRight size={17}/>}</button><button className="secondary-btn" onClick={reset} disabled={!file && !result}><Trash2 size={17}/> Reset</button></div>{error && <div role="alert" className="error-note"><AlertCircle size={17}/>{error}</div>}
        </div>
        <div className="card guide-card"><div className="card-heading"><div className="title-with-icon"><span className="soft-icon"><SlidersHorizontal size={19}/></span><div><h3>Analysis breakdown</h3><p>What we look for in your photo</p></div></div></div><div className="guide-list"><div className="guide-row"><div className="guide-number">01</div><div><strong>Sharpness & focus</strong><p>Measure edge detail and potential image blur.</p></div><span className="guide-symbol"><ScanLine size={20}/></span></div><div className="guide-row"><div className="guide-number">02</div><div><strong>Light & exposure</strong><p>Identify possible underexposure or overexposure.</p></div><span className="guide-symbol"><Sparkles size={20}/></span></div><div className="guide-row"><div className="guide-number">03</div><div><strong>Visual quality estimate</strong><p>Estimate a KADID-domain perceptual quality score.</p></div><span className="guide-symbol"><BarChart3 size={20}/></span></div></div><div className="note-panel"><Info size={18}/><p>Results are diagnostic signals, not guaranteed marketplace approval. Thresholds are provisional.</p></div><div className="backend-status"><span>Analysis engine</span><span className={hasModel ? 'available' : 'not-available'}><span className="dot"/>{hasModel ? 'Model ready' : isReady ? 'Model unavailable' : 'Not connected'}</span></div>{health?.model_error && <div className="model-note">{health.model_error}</div>}</div></section>
        <section id="results-section" className="results-section"><div className="section-heading results-heading"><div><span className="section-kicker">YOUR RESULTS</span><h2>Analysis report</h2><p>Understand the signals behind the recommendation.</p></div><span className="step-label"><span>02</span> / 02</span></div>
        {!result ? <div className="empty-results"><div className="empty-symbol"><ClipboardCheck size={29}/></div><h3>Ready when you are.</h3><p>{busy ? 'Your photo is being analyzed by the backend.' : 'Your photo insights will appear here after analysis.'}</p>{busy ? <div className="loading-track"><span /></div> : <button className="text-link" onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior:'smooth'})}>Upload a photo <ArrowRight size={15}/></button>}</div> : <div className="result-stack fade-in"><div className="result-overview card"><div className="result-summary"><div className={`result-icon ${review ? 'review' : 'pass'}`}>{review ? <AlertCircle size={22}/> : <CheckCircle2 size={22}/>}</div><div><div className="report-kicker">DIAGNOSTIC RECOMMENDATION</div><h3>{review ? 'Photo needs review' : 'No threshold alerts detected'}</h3><p>{review ? result.reasons.map(x => reasonLabel[x] || x).join(' · ') : 'No blur or exposure thresholds were triggered. Manual review may still be needed.'}</p></div></div><span className={`result-pill ${review ? 'review' : 'pass'}`}>{review ? 'REVIEW' : 'PASS · PROVISIONAL'}</span></div>
        <div className="result-metrics"><div className="card score-card"><div className="score-head"><span>AI QUALITY ESTIMATE</span><span className="soft-icon"><Sparkles size={18}/></span></div><div className="score-value">{score === null ? '—' : nf(score, 2)}<small> / 5</small></div><Meter value={score || 0} max={5}/><p>{result.quality_estimate.available ? 'KADID synthetic-distortion quality scale' : 'Model estimate currently unavailable'}</p></div><div className="card signal-card"><StatItem title="Sharpness signal" value={nf(m?.laplacian_var || 0, 1)} hint="Laplacian variance" tone="blue"/><Meter value={Math.min(m?.laplacian_var || 0, 600)} max={600} theme="blue"/><p>Higher values indicate more edge response, but depend on image content.</p></div><div className="card signal-card"><StatItem title="Avg. brightness" value={nf(m?.brightness_mean || 0, 1)} hint="Intensity / 255" tone="amber"/><Meter value={m?.brightness_mean || 0} max={255} theme="amber"/><p>Brightness should be interpreted with the subject and background.</p></div></div>
        <div className="card detail-card"><div className="detail-heading"><div><h3>Detailed image metrics</h3><p>Raw feature measurements from the uploaded photo</p></div><button className="secondary-btn small" onClick={() => setShowDetails(v=>!v)}>{showDetails ? 'Hide details' : 'View details'} <ChevronDown className={showDetails ? 'chevron-up' : ''} size={15}/></button></div><div className="detail-summary"><div><span>Resolution</span><strong>{m?.width} × {m?.height}</strong></div><div><span>Contrast range</span><strong>{nf(m?.contrast_p95_p5 || 0)}</strong></div><div><span>Colorfulness</span><strong>{nf(m?.colorfulness || 0, 1)}</strong></div><div><span>Exposure flags</span><strong>{result.reasons.length}</strong></div></div>{showDetails && <div className="raw-metrics">{m && Object.entries(m).map(([key,value]) => <div key={key}><span>{key.replaceAll('_',' ')}</span><strong>{nf(value, 4)}</strong></div>)}</div>}</div><div className="report-actions"><span><Info size={16}/> {result.disclaimer}</span><button className="secondary-btn" onClick={() => downloadJson(result)}><Download size={17}/> Export JSON <ArrowDown size={14}/></button></div></div>}</section>
        </>}
        <footer className="footer"><span>© 2026 ProductPhoto QA <span>·</span> Day 18 of 100</span><span>Research-backed. Human-guided. <span className="foot-mark"><ScanLine size={14}/></span></span></footer>
      </main>
    </div>
  </div>;
}
export default App;
