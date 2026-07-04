import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, XCircle, Code, FileCode, Sparkles, Trash2, HelpCircle } from 'lucide-react';
import JSZip from 'jszip';
import { ApplyResult } from '../types';

interface CodeInputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  onApply: () => void;
  applyResult: ApplyResult | null;
  setApplyResult: (res: ApplyResult | null) => void;
  onFileLoaded: (code: string, description: string, isZip: boolean) => void;
}

export default function CodeInputArea({
  inputText,
  setInputText,
  onApply,
  applyResult,
  setApplyResult,
  onFileLoaded
}: CodeInputAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setFileLoading(true);
    const fileName = file.name.toLowerCase();
    
    try {
      if (fileName.endsWith('.zip')) {
        const zip = new JSZip();
        const content = await zip.loadAsync(file);
        
        // Find index.html first
        let htmlFile = content.file("index.html");
        let foundPath = "index.html";
        
        if (!htmlFile) {
          // Find any file ending with .html
          const htmlFiles = Object.keys(content.files).filter(
            name => name.endsWith('.html') && !content.files[name].dir
          );
          if (htmlFiles.length > 0) {
            htmlFile = content.file(htmlFiles[0]);
            foundPath = htmlFiles[0];
          }
        }
        
        if (htmlFile) {
          const text = await htmlFile.async("string");
          onFileLoaded(text, `Fail ZIP: ${file.name} (mengekstrak ${foundPath})`, true);
        } else {
          setApplyResult({
            success: false,
            message: `Gagal membaca ZIP: Fail "${file.name}" tidak mempunyai sebarang fail .html di dalamnya.`,
            type: 'error',
            blocksProcessed: 0,
            blocksSucceeded: 0,
            failedBlocks: []
          });
        }
      } else if (fileName.endsWith('.html') || fileName.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          onFileLoaded(text, `Fail difailkan: ${file.name}`, false);
        };
        reader.readAsText(file);
      } else {
        setApplyResult({
          success: false,
          message: 'Sila muat naik fail berformat .html, .txt, atau .zip sahaja.',
          type: 'error',
          blocksProcessed: 0,
          blocksSucceeded: 0,
          failedBlocks: []
        });
      }
    } catch (err: any) {
      console.error(err);
      setApplyResult({
        success: false,
        message: `Ralat semasa memproses fail: ${err.message || err}`,
        type: 'error',
        blocksProcessed: 0,
        blocksSucceeded: 0,
        failedBlocks: []
      });
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setInputText('');
    setApplyResult(null);
  };

  return (
    <div id="code-input-area" className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg">
            <Code size={18} />
          </div>
          <h3 className="font-bold text-slate-800 text-base font-display">Ruang Input Kod / Patch</h3>
        </div>
        
        <div className="flex gap-2">
          {inputText && (
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
              title="Kosongkan ruangan input"
            >
              <Trash2 size={13} />
              <span>Padam</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Area / Textarea wrapper */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex-grow flex flex-col rounded-xl border-2 min-h-[300px] md:min-h-[350px] transition ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/40 ring-4 ring-indigo-500/10' 
            : 'border-slate-200/80 bg-slate-50/30 hover:border-slate-300'
        }`}
      >
        {/* Drag and Drop visual helper when dragging */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-indigo-600/90 rounded-lg flex flex-col items-center justify-center text-white p-6 transition-all animate-fade-in pointer-events-none">
            <UploadCloud size={56} className="mb-4 animate-bounce" />
            <h4 className="text-lg font-bold font-display mb-1">Lepaskan Fail Anda Di Sini!</h4>
            <p className="text-sm text-indigo-100 max-w-sm text-center leading-relaxed">
              Kami akan membaca fail HTML, fail teks, atau fail ZIP dan memuatkannya ke dalam pengedit secara automatik.
            </p>
          </div>
        )}

        {/* Textarea */}
        <textarea
          id="code-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tampalkan (paste) HTML penuh untuk mula baru, atau paste blok PATCH (SEARCH/REPLACE) daripada AI untuk mengemaskini..."
          className="w-full flex-grow p-4 text-xs font-mono bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
          style={{ minHeight: '260px' }}
        />

        {/* Drag-and-drop info and upload trigger footer bar */}
        <div className="border-t border-slate-100 px-4 py-3 bg-white rounded-b-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Atau drop fail <strong>.html, .txt</strong> atau <strong>.zip</strong> di sini</span>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={fileLoading}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-100 transition cursor-pointer flex items-center gap-1.5"
          >
            <UploadCloud size={14} />
            <span>{fileLoading ? 'Membaca...' : 'Pilih Fail / ZIP'}</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html,.txt,.zip"
            className="hidden"
          />
        </div>
      </div>

      {/* Terap & Paparkan Action Button */}
      <div className="mt-4">
        <button
          id="apply-and-display-btn"
          onClick={onApply}
          disabled={!inputText.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition transform cursor-pointer active:scale-[0.98] ${
            inputText.trim()
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-100 hover:shadow-lg'
              : 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
          }`}
        >
          <Sparkles size={16} />
          <span>Terap & Paparkan Hasil Laman Web</span>
        </button>
      </div>

      {/* Result Indicator Banner */}
      {applyResult && (
        <div 
          id="apply-result-banner"
          className={`mt-4 p-4 rounded-xl border animate-fade-in ${
            applyResult.success
              ? applyResult.type === 'full-html'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : applyResult.blocksSucceeded < applyResult.blocksProcessed
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {applyResult.success ? (
                applyResult.type === 'full-html' || applyResult.blocksSucceeded === applyResult.blocksProcessed ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-600" />
                )
              ) : (
                <XCircle size={18} className="text-rose-600" />
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
                {applyResult.success 
                  ? applyResult.type === 'full-html'
                    ? 'Laman Web Baharu Dimuatkan'
                    : 'Patch Berjaya Diterapkan' 
                  : 'Gagal Menerapkan Kemaskini'}
              </h4>
              <p className="text-xs leading-relaxed">{applyResult.message}</p>
              
              {/* Detailed blocks feedback */}
              {applyResult.type === 'patch' && applyResult.failedBlocks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-dashed border-amber-200 text-[11px] space-y-1.5">
                  <span className="font-bold text-amber-900">Maklumat Ralat Patch:</span>
                  {applyResult.failedBlocks.map((err) => (
                    <div key={err.index} className="bg-amber-100/50 p-2 rounded border border-amber-200/50 text-slate-700">
                      <span className="font-bold text-rose-700">Blok #{err.index}:</span> {err.error}
                      <div className="mt-1 font-mono text-[10px] bg-white/70 p-1.5 rounded border border-slate-200 text-slate-600 truncate">
                        Cari: "{err.searchSnippet}"
                      </div>
                      <span className="block mt-1 text-[10px] text-slate-500 italic">
                        Tip: Teks SEARCH mesti sepadan 100% tepat termasuk baris baru, jarak kosong, dan huruf besar/kecil.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
