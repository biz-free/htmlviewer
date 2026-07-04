import { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { AI_PROMPT_INSTRUCTIONS } from '../constants';

export default function InstructionCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_INSTRUCTIONS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  return (
    <div id="instruction-card" className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg border border-indigo-400/30">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Panduan Ringkas</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white mb-2">
            Bagaimana ia berfungsi?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Aplikasi ini adalah alat <strong className="text-indigo-200">"terap & papar"</strong> sahaja. Anda tidak perlu tahu kod atau pengaturcaraan! Semua reka bentuk dijana oleh AI (seperti Gemini, Claude, dll.) dalam perbualan berasingan, dan anda hanya paste di sini untuk melihat hasilnya terus.
          </p>
          
          {/* 3 Langkah Cara Guna */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs font-bold text-white">1</span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-200">Mula Perbualan AI</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Salin arahan khas AI di sebelah kanan, dan tampalkannya (paste) di perbualan baharu AI anda.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs font-bold text-white">2</span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-200">Bina Laman Utama</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Minta AI membina laman web (cth. Kedai Kopi). AI akan memberi kod HTML penuh — paste di sini untuk mula.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs font-bold text-white">3</span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-200">Kemaskini Guna Patch</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Minta perubahan seterusnya (cth. Tukar warna tajuk). AI akan beri kod "PATCH" sahaja — paste dan terap!
              </p>
            </div>
          </div>
        </div>
        
        {/* Butang Salin Arahan */}
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[240px] md:self-stretch">
          <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-full mb-3 border border-indigo-400/20">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <h4 className="text-sm font-extrabold text-white mb-1">Hantar Ini Kepada AI</h4>
          <p className="text-[11px] text-slate-300 max-w-[200px] mb-4">
            Berikan arahan ini dahulu supaya AI menghantar kod dalam format yang betul.
          </p>
          <button
            id="copy-ai-instructions"
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition transform hover:scale-[1.02] cursor-pointer ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-950/40'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Berjaya Disalin!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Salin Arahan untuk AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
