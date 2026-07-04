import { useState, useRef, useEffect } from 'react';
import { 
  Laptop, Tablet, Smartphone, Copy, Check, Download, Undo, 
  RotateCw, Eye, Code as CodeIcon, ExternalLink, RefreshCw,
  Maximize2, Minimize2, Sparkles
} from 'lucide-react';
import { UndoItem } from '../types';

interface PreviewAreaProps {
  currentCode: string;
  undoList: UndoItem[];
  onUndo: () => void;
  onReset: () => void;
}

export default function PreviewArea({ currentCode, undoList, onUndo, onReset }: PreviewAreaProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // to force refresh the iframe
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-refresh iframe when currentCode changes
  useEffect(() => {
    setIframeKey((prev) => prev + 1);
  }, [currentCode]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([currentCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'laman-web-saya.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal muat turun:', err);
    }
  };

  const handleIframeReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Get dynamic width for the responsive iframe wrapper
  const getDeviceWidth = (customMode?: 'desktop' | 'tablet' | 'mobile') => {
    const mode = customMode || deviceMode;
    switch (mode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div id="preview-area" className="bg-white rounded-2xl border border-slate-200/80 shadow-md flex flex-col h-full overflow-hidden">
      {/* Top Header of Preview Card */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        
        {/* View mode toggle (Preview vs Code) */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl w-fit self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Eye size={13} />
            <span>Paparan Live</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <CodeIcon size={13} />
            <span>Lihat Kod HTML</span>
          </button>
        </div>

        {/* Device responsive preview toggles (Only show when on Preview tab) */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Komputer riba (Penuh)"
            >
              <Laptop size={14} />
              <span className="hidden lg:inline text-[10px]">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                deviceMode === 'tablet'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tablet (768px)"
            >
              <Tablet size={14} />
              <span className="hidden lg:inline text-[10px]">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Telefon Pintar (375px)"
            >
              <Smartphone size={14} />
              <span className="hidden lg:inline text-[10px]">Mobile</span>
            </button>
          </div>
        )}

        {/* Actions bar (Undo, Reset, Download, Copy) */}
        <div className="flex items-center gap-1.5">
          {/* Undo action button */}
          <button
            onClick={onUndo}
            disabled={undoList.length === 0}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
              undoList.length > 0
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-[0.97]'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title={`Buat asal perubahan (${undoList.length} tahap sedia ada)`}
          >
            <Undo size={13} />
            <span>Undo ({undoList.length})</span>
          </button>
        </div>
      </div>

      {/* Simulated Browser Bar (Only shown on preview tab to look like a browser) */}
      {activeTab === 'preview' && (
        <div className="bg-slate-100/50 border-b border-slate-200/50 px-4 py-2 flex items-center gap-3 flex-shrink-0">
          {/* Mock Window Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>

          {/* Address Bar */}
          <div className="flex-grow bg-white/90 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-slate-500 font-sans shadow-inner max-w-lg mx-auto">
            <span className="truncate font-medium text-slate-600">https://laman-web-anda.ai/</span>
            <div className="flex items-center gap-3 text-slate-400 flex-shrink-0">
              <button 
                onClick={handleIframeReload}
                className="hover:text-slate-700 transition cursor-pointer p-0.5"
                title="Segarkan semula preview"
              >
                <RefreshCw size={11} />
              </button>
              <span className="text-slate-200">|</span>
              <button 
                onClick={() => setIsFullscreen(true)}
                className="hover:text-indigo-700 text-indigo-600 transition cursor-pointer p-0.5 flex items-center gap-1 font-bold text-[10px]"
                title="Buka dalam Skrin Penuh"
              >
                <Maximize2 size={11} />
                <span>Skrin Penuh</span>
              </button>
            </div>
          </div>
          
          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>
      )}

      {/* Main Sandbox Iframe/Code Content */}
      <div className="flex-grow bg-slate-100/60 p-4 flex justify-center items-stretch overflow-hidden relative">
        {activeTab === 'preview' ? (
          <div className={`w-full h-full flex justify-center items-center`}>
            <div className={`w-full h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${getDeviceWidth()}`}>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                srcDoc={currentCode}
                title="Laman Web Preview"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col relative">
            <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 text-xs text-slate-400 font-mono flex-shrink-0 border-b border-slate-800">
              <span>laman-web-saya.html</span>
              <span className="text-indigo-400">HTML5 + CSS + JavaScript</span>
            </div>
            <pre className="flex-grow overflow-auto p-4 text-xs font-mono text-slate-300 leading-relaxed bg-slate-900 select-all select-text">
              <code>{currentCode}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Footer Control Actions (Download, Copy) */}
      <div className="border-t border-slate-100 bg-white px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
        <p className="text-xs text-slate-500 font-sans text-center sm:text-left">
          Laman web ini dibina menggunakan HTML, Tailwind CSS, dan JavaScript secara inline.
        </p>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Copy HTML button */}
          <button
            onClick={handleCopyCode}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition transform cursor-pointer border ${
              copiedCode
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-[0.98]'
            }`}
          >
            {copiedCode ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedCode ? 'Berjaya Disalin!' : 'Salin Kod (Untuk Simpan / AI)'}</span>
          </button>

          {/* Download HTML button */}
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition transform active:scale-[0.98] cursor-pointer"
          >
            <Download size={14} />
            <span>Muat Turun HTML</span>
          </button>
        </div>
      </div>

      {/* Skrin Penuh Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col p-4 sm:p-6 animate-fade-in">
          {/* Header Controls of Fullscreen Overlay */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 mb-4 text-white">
            
            {/* Title / Info */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-950/50">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white font-display">Mod Pengujian Skrin Penuh</h3>
                <p className="text-[10px] text-slate-400">Gunakan mod ini untuk menguji segala fungsi butang, pautan, dan animasi secara penuh</p>
              </div>
            </div>

            {/* Device Responsive Controls inside Fullscreen */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop size={14} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet size={14} />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={14} />
                <span>Telefon</span>
              </button>
            </div>

            {/* Utility buttons & Exit button */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleIframeReload}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs"
                title="Semula halaman"
              >
                <RefreshCw size={13} />
                <span>Segarkan</span>
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-rose-950/30 transition transform active:scale-[0.98] cursor-pointer flex items-center gap-2 text-xs"
              >
                <Minimize2 size={14} />
                <span>Keluar Skrin Penuh (ESC)</span>
              </button>
            </div>
          </div>

          {/* Large Sandbox Iframe wrapper inside fullscreen */}
          <div className="flex-grow flex justify-center items-center overflow-hidden">
            <div className={`w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300 ${getDeviceWidth()}`}>
              <iframe
                key={`fs-${iframeKey}`}
                srcDoc={currentCode}
                title="Laman Web Skrin Penuh"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
