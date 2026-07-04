import { useState, useEffect } from 'react';
import { 
  Sparkles, RotateCcw, AlertCircle, ShieldAlert, CheckCircle, 
  Trash2, X, RefreshCw, Layers 
} from 'lucide-react';
import { DEFAULT_HTML_TEMPLATE } from './constants';
import { ApplyResult, UndoItem } from './types';
import { applyChanges, detectContentType } from './utils/patchParser';

import InstructionCard from './components/InstructionCard';
import CodeInputArea from './components/CodeInputArea';
import PreviewArea from './components/PreviewArea';

export default function App() {
  const [currentCode, setCurrentCode] = useState<string>('');
  const [undoList, setUndoList] = useState<UndoItem[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [applyResult, setApplyResult] = useState<ApplyResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [appNotification, setAppNotification] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  // Load initial code and undo history from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('pembina_ai_kod_semasa');
    const savedUndo = localStorage.getItem('pembina_ai_undo_list');

    if (savedCode) {
      setCurrentCode(savedCode);
    } else {
      setCurrentCode(DEFAULT_HTML_TEMPLATE);
      localStorage.setItem('pembina_ai_kod_semasa', DEFAULT_HTML_TEMPLATE);
    }

    if (savedUndo) {
      try {
        setUndoList(JSON.parse(savedUndo));
      } catch (e) {
        setUndoList([]);
      }
    }
  }, []);

  // Display a temporary application notification
  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setAppNotification({ type, message });
    setTimeout(() => {
      setAppNotification(null);
    }, 4000);
  };

  // Handle core logic when the user clicks "Terap & Paparkan"
  const handleApply = () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    const detectedType = detectContentType(trimmedInput);

    // 1. Unrecognized format
    if (detectedType === 'unknown') {
      setApplyResult({
        success: false,
        message: 'Format kandungan tidak dikenali. Sila pastikan anda paste HTML penuh (cth. bermula dengan <!DOCTYPE html> atau tag <html>) atau blok patch (format <<<<<<< SEARCH) yang sah dari AI.',
        type: 'error',
        blocksProcessed: 0,
        blocksSucceeded: 0,
        failedBlocks: []
      });
      triggerNotification('Ralat format kod!', 'error');
      return;
    }

    // Capture state for Undo before applying
    const newUndoItem: UndoItem = {
      code: currentCode,
      timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label: detectedType === 'full-html' ? 'Gantian Kod Penuh' : 'Terap Patch AI'
    };

    const updatedUndoList = [newUndoItem, ...undoList].slice(0, 5); // Keep max 5 backups

    // 2. Full HTML replacement logic
    if (detectedType === 'full-html') {
      // Save undo
      setUndoList(updatedUndoList);
      localStorage.setItem('pembina_ai_undo_list', JSON.stringify(updatedUndoList));

      // Update current code
      setCurrentCode(trimmedInput);
      localStorage.setItem('pembina_ai_kod_semasa', trimmedInput);

      // Clear textarea input and set success result
      setInputText('');
      setApplyResult({
        success: true,
        message: 'Laman web berjaya dimuatkan sepenuhnya!',
        type: 'full-html',
        blocksProcessed: 0,
        blocksSucceeded: 0,
        failedBlocks: []
      });

      triggerNotification('Laman web penuh berjaya diterap!', 'success');
      return;
    }

    // 3. Patch parsing & substitution logic
    if (detectedType === 'patch') {
      // If there's no website code to patch
      if (!currentCode || currentCode === '') {
        setApplyResult({
          success: false,
          message: 'Tiada laman web sedia ada. Sila paste HTML penuh terlebih dahulu untuk mula.',
          type: 'error',
          blocksProcessed: 0,
          blocksSucceeded: 0,
          failedBlocks: []
        });
        triggerNotification('Gagal menerapkan patch!', 'error');
        return;
      }

      const res = applyChanges(currentCode, trimmedInput);

      if (res.success) {
        // Compute new patched code
        let tempCode = currentCode;
        const patches = res.blocksProcessed;
        const succeeded = res.blocksSucceeded;

        // Apply patches in the state (applyChanges already calculated successful patches)
        // To be safe, we re-apply here using our utility code or let applyChanges return the final text too.
        // Let's modify applyChanges utility to return the final text directly, or calculate it.
        // Wait, let's check applyChanges in patchParser.ts:
        // Inside patchParser.ts, we calculated tempCode and checked if succeeded > 0.
        // Let's update patchParser.ts slightly or do the replacement directly here.
        // Actually, we can update patchParser.ts to return `{ success, message, type, blocksProcessed, blocksSucceeded, failedBlocks, patchedCode?: string }`!
        // That is much cleaner. Let's inspect our patchParser.ts first, or we can just run it. Yes, we will modify it to return patchedCode.
      }
    }
  };

  // Enhanced handleApply with patched code retrieval
  const handleApplyEnhanced = () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    const detectedType = detectContentType(trimmedInput);

    if (detectedType === 'unknown') {
      setApplyResult({
        success: false,
        message: 'Format kandungan tidak dikenali. Sila pastikan anda paste HTML penuh (cth. ada tag <html>) atau blok patch yang sah dari AI.',
        type: 'error',
        blocksProcessed: 0,
        blocksSucceeded: 0,
        failedBlocks: []
      });
      triggerNotification('Format tidak dikenali!', 'error');
      return;
    }

    // Capture backup
    const newUndoItem: UndoItem = {
      code: currentCode,
      timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label: detectedType === 'full-html' ? 'Kod Penuh' : 'Patch'
    };
    const updatedUndoList = [newUndoItem, ...undoList].slice(0, 5);

    if (detectedType === 'full-html') {
      setUndoList(updatedUndoList);
      localStorage.setItem('pembina_ai_undo_list', JSON.stringify(updatedUndoList));

      setCurrentCode(trimmedInput);
      localStorage.setItem('pembina_ai_kod_semasa', trimmedInput);

      setInputText('');
      setApplyResult({
        success: true,
        message: 'Laman web penuh telah berjaya dimuatkan!',
        type: 'full-html',
        blocksProcessed: 0,
        blocksSucceeded: 0,
        failedBlocks: []
      });
      triggerNotification('Laman web penuh dimuatkan!', 'success');
      return;
    }

    if (detectedType === 'patch') {
      if (!currentCode.trim()) {
        setApplyResult({
          success: false,
          message: 'Tiada laman web sedia ada. Sila paste HTML penuh terlebih dahulu sebelum memohon sebarang kemaskini patch.',
          type: 'error',
          blocksProcessed: 0,
          blocksSucceeded: 0,
          failedBlocks: []
        });
        triggerNotification('Gagal: Muatkan HTML dahulu', 'error');
        return;
      }

      // Parse and patch
      const res = applyChanges(currentCode, trimmedInput);
      
      if (res.success && res.blocksSucceeded > 0) {
        // Apply the successful patches to construct the final patched text
        // Let's do the actual code patching here using the exact same logic
        const normalizedInput = trimmedInput.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        // Extract patches manually to do actual patching
        const matches = parsePatchesText(normalizedInput);
        let tempCode = currentCode.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        matches.forEach(patch => {
          const searchIdx = tempCode.indexOf(patch.search);
          if (searchIdx !== -1) {
            tempCode = tempCode.substring(0, searchIdx) + patch.replace + tempCode.substring(searchIdx + patch.search.length);
          }
        });

        // Save undo list
        setUndoList(updatedUndoList);
        localStorage.setItem('pembina_ai_undo_list', JSON.stringify(updatedUndoList));

        // Update current code
        setCurrentCode(tempCode);
        localStorage.setItem('pembina_ai_kod_semasa', tempCode);
        
        // Empty the paste area on complete success, or keep it if there are failures so they can review
        if (res.blocksSucceeded === res.blocksProcessed) {
          setInputText('');
        }

        setApplyResult(res);
        triggerNotification(`${res.blocksSucceeded} patch berjaya diterap!`, 'success');
      } else {
        // Failed patch
        setApplyResult(res);
        triggerNotification('Gagal menerapkan patch!', 'error');
      }
    }
  };

  // Local copy of patch parser to build the final text safely
  const parsePatchesText = (text: string) => {
    const blocks: { search: string; replace: string }[] = [];
    let pos = 0;
    while (true) {
      const searchIdx = text.indexOf('<<<<<<< SEARCH', pos);
      if (searchIdx === -1) break;
      
      const dividerIdx = text.indexOf('=======', searchIdx);
      if (dividerIdx === -1) {
        pos = searchIdx + 14;
        continue;
      }
      
      const replaceIdx = text.indexOf('>>>>>>> REPLACE', dividerIdx);
      if (replaceIdx === -1) {
        pos = dividerIdx + 7;
        continue;
      }
      
      let searchStart = searchIdx + 14;
      if (text[searchStart] === '\n') searchStart++;
      let searchEnd = dividerIdx;
      if (text[searchEnd - 1] === '\n') searchEnd--;
      const searchVal = text.substring(searchStart, searchEnd);
      
      let replaceStart = dividerIdx + 7;
      if (text[replaceStart] === '\n') replaceStart++;
      let replaceEnd = replaceIdx;
      if (text[replaceEnd - 1] === '\n') replaceEnd--;
      const replaceVal = text.substring(replaceStart, replaceEnd);
      
      blocks.push({ search: searchVal, replace: replaceVal });
      pos = replaceIdx + 15;
    }
    return blocks;
  };

  // Rollback to the previous version
  const handleUndo = () => {
    if (undoList.length === 0) return;

    const previousItem = undoList[0];
    const newUndoList = undoList.slice(1);

    setCurrentCode(previousItem.code);
    localStorage.setItem('pembina_ai_kod_semasa', previousItem.code);

    setUndoList(newUndoList);
    localStorage.setItem('pembina_ai_undo_list', JSON.stringify(newUndoList));

    setApplyResult(null);
    triggerNotification(`Berjaya dikembalikan ke versi asal (${previousItem.timestamp})`, 'info');
  };

  // Reset entirely back to default template
  const handleReset = () => {
    const newUndoItem: UndoItem = {
      code: currentCode,
      timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label: 'Reset Penuh'
    };
    const updatedUndoList = [newUndoItem, ...undoList].slice(0, 5);
    
    setUndoList(updatedUndoList);
    localStorage.setItem('pembina_ai_undo_list', JSON.stringify(updatedUndoList));

    setCurrentCode(DEFAULT_HTML_TEMPLATE);
    localStorage.setItem('pembina_ai_kod_semasa', DEFAULT_HTML_TEMPLATE);
    
    setInputText('');
    setApplyResult(null);
    setShowResetConfirm(false);
    triggerNotification('Laman web berjaya di-reset!', 'info');
  };

  // Handler when a file (HTML, TXT, or ZIP) is loaded
  const handleFileLoaded = (code: string, description: string, isZip: boolean) => {
    setInputText(code);
    
    // Set a temporary indicator result
    setApplyResult({
      success: true,
      message: `${description} berjaya dimuatkan ke dalam Ruang Input! Klik butang "Terap & Paparkan" di bawah untuk melihat kemaskini.`,
      type: 'full-html',
      blocksProcessed: 0,
      blocksSucceeded: 0,
      failedBlocks: []
    });
    
    triggerNotification('Fail sedia untuk diterap!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Dynamic Small Toast App Notifications */}
      {appNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-bounce transition-all bg-white text-slate-800 border-slate-200">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span>{appNotification.message}</span>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight font-display text-slate-900 leading-none">
                Pembina Laman Web AI
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                ALAT TERAP & PAPAR OFFLINE • UNTUK ORANG AWAM
              </p>
            </div>
          </div>

          {/* Quick Actions (Reset button) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
              title="Kembalikan laman web kepada template permulaan asal"
            >
              <RotateCcw size={13} />
              <span>Mula Baharu (Reset)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        
        {/* Instruction Card Banner */}
        <InstructionCard />

        {/* Dynamic Column Grid Layout: 5/12 span for input, 7/12 span for preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
          
          {/* Left Column: Code input area */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <CodeInputArea
              inputText={inputText}
              setInputText={setInputText}
              onApply={handleApplyEnhanced}
              applyResult={applyResult}
              setApplyResult={setApplyResult}
              onFileLoaded={handleFileLoaded}
            />
          </div>

          {/* Right Column: Visual Preview & Browser Mockup */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
            <PreviewArea
              currentCode={currentCode}
              undoList={undoList}
              onUndo={handleUndo}
              onReset={() => setShowResetConfirm(true)}
            />
          </div>
        </div>
      </main>

      {/* Modern, Simple and Humble Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 <strong>Pembina Laman Web AI</strong> • Direka untuk memudahkan orang awam yang tidak tahu coding menguji reka bentuk AI.
          </p>
          <div className="flex gap-4">
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-600">Tiada Panggilan API Berbayar • 100% Tempatan</span>
          </div>
        </div>
      </footer>

      {/* Custom Clean Confirm Modal for Resetting */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-full border border-rose-100 flex-shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-950 font-display">Adakah anda pasti?</h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-1">
                  Tindakan ini akan menetapkan semula laman web semasa anda kepada template permulaan asal. Anda boleh mengembalikannya semula menggunakan butang 'Undo' jika anda menyesal.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-100 transition cursor-pointer"
              >
                Ya, Mula Baharu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
