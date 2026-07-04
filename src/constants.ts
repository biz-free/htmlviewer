export const AI_PROMPT_INSTRUCTIONS = `Kita akan bina laman web bersama secara berperingkat. Ikut peraturan ni:
- Kali PERTAMA sahaja (atau bila saya minta 'reset'/'mula baharu'), balas dengan SATU fail HTML penuh (HTML+CSS+JS sekali, guna tag style dan script inline). Jangan tambah ayat pembuka atau format code-fence markdown — hanya kod HTML sahaja.
- Untuk SETIAP permintaan perubahan SELEPAS itu, JANGAN hantar HTML penuh semula. Balas HANYA dengan satu atau lebih blok patch format ini:
<<<<<<< SEARCH
[potongan kod ASAL yang tepat huruf-demi-huruf]
=======
[kod BAHARU untuk gantikan potongan di atas]
>>>>>>> REPLACE
- Pastikan teks dalam bahagian SEARCH sepadan TEPAT (termasuk jarak/whitespace) dengan kod yang saya ada sekarang, supaya boleh saya "cari & ganti" secara automatik.
- Jangan tambah apa-apa teks lain di luar blok patch (tiada ayat pembuka, tiada penjelasan, tiada format code-fence markdown).`;

export const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laman Web Saya yang Hebat</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    body {
      background-color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>
</head>
<body class="flex flex-col min-h-screen text-slate-800">
  <!-- Navigasi -->
  <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <span class="text-3xl">✨</span>
        <span class="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Syarikat Impian</span>
      </div>
      <nav class="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
        <a href="#utama" class="hover:text-indigo-600 transition">Utama</a>
        <a href="#kelebihan" class="hover:text-indigo-600 transition">Kelebihan</a>
        <a href="#hubungi" class="hover:text-indigo-600 transition text-indigo-600">Hubungi</a>
      </nav>
      <a href="#hubungi" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-sm">
        Mula Sekarang
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-grow">
    <section id="utama" class="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
      <div class="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-pulse">
        <span>🎉</span>
        <span>Laman Web AI Anda Sedia Diteroka!</span>
      </div>
      
      <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6 max-w-4xl">
        Bina Laman Web Impian Anda <br class="hidden md:block"/>
        <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Tanpa Sebaris Kod!</span>
      </h1>
      
      <p class="text-base md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed font-light">
        Ini ialah contoh laman web permulaan anda. Paste kod penuh atau blok patch daripada AI anda (seperti Gemini) di sebelah kiri untuk menukar laman web ini serta-merta!
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
        <a href="#kelebihan" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md shadow-indigo-100 transition transform hover:-translate-y-0.5">
          Lihat Kelebihan
        </a>
        <a href="#hubungi" class="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl border border-slate-200 transition transform hover:-translate-y-0.5">
          Hubungi Kami
        </a>
      </div>
      
      <!-- Ciri-ciri Ringkas -->
      <div id="kelebihan" class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20 text-left">
        <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">🎨</div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Mudah Diubahsuai</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Minta AI untuk menukar warna, susun atur, atau menambah bahagian baharu mengikut kehendak anda.</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">⚡</div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Pantas & Ringan</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Menggunakan Tailwind CSS untuk pemuatan yang sangat pantas dan paparan yang responsif pada semua peranti.</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl font-bold mb-6">📱</div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Sedia Responsif</h3>
          <p class="text-slate-600 text-sm leading-relaxed">Laman web kelihatan cantik dan sempurna sama ada pada telefon pintar, tablet, mahupun komputer riba.</p>
        </div>
      </div>
    </section>

    <!-- Hubungi Kami Section -->
    <section id="hubungi" class="bg-slate-50 py-16 md:py-24 border-t border-slate-100">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-extrabold text-slate-900 mb-4">Hubungi Kami</h2>
        <p class="text-slate-600 max-w-lg mx-auto mb-10 text-sm md:text-base">Mempunyai sebarang pertanyaan? Kami sedia membantu anda merealisasikan laman web impian anda.</p>
        <form class="max-w-md mx-auto space-y-4 text-left" onsubmit="event.preventDefault(); alert('Terima kasih! Mesej anda telah dihantar (Simulasi).');">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Penuh</label>
            <input type="text" placeholder="Masukkan nama anda" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required/>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Alamat E-mel</label>
            <input type="email" placeholder="contoh@gmail.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required/>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mesej Anda</label>
            <textarea placeholder="Bagaimana kami boleh membantu anda?" rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required></textarea>
          </div>
          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md shadow-indigo-100">
            Hantar Mesej
          </button>
        </form>
      </div>
    </section>
  </main>

  <!-- Kaki Laman -->
  <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-sm">
      <p>© 2026 Syarikat Impian. Dibina secara kolaboratif menggunakan Pembina Laman Web AI.</p>
      <div class="flex space-x-6">
        <a href="#utama" class="hover:text-white transition">Privasi</a>
        <a href="#utama" class="hover:text-white transition">Syarat Perkhidmatan</a>
      </div>
    </div>
  </footer>
</body>
</html>`;
