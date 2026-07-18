/* =========================================================
   EDU EXPO — SMK MUTIARA BANGSA 1
   script.js — Modular vanilla JS
   Every module checks for its DOM target before running,
   so this single file is safe to include on every page.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initScrollProgress();
  initNavbar();
  initThemeToggle();
  initRevealOnScroll();
  initBackToTop();
  initCountdown();
  initCounters();
  initTimelineNumbers();
  initFaqAccordion();
  initFilterBar();
  initBoothModal();
  initGalleryLightbox();
  initRedeemPage();
  initContactForm();
  initLazyLoad();
});

/* ---------- LOADING SCREEN ---------- */
function initLoadingScreen(){
  const loader = document.getElementById('loading-screen');
  if(!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);
}

/* ---------- SCROLL PROGRESS BAR ---------- */
function initScrollProgress(){
  const bar = document.getElementById('scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  });
}

/* ---------- NAVBAR: scrolled state + mobile toggle + active link ---------- */
function initNavbar(){
  const nav = document.querySelector('.navbar');
  if(!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // mark active link based on current page filename
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if(href === current) a.classList.add('active');
  });
}

/* ---------- DARK MODE TOGGLE ---------- */
function initThemeToggle(){
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('eduexpo-theme');
  if(saved === 'dark') root.setAttribute('data-theme','dark');
  if(!toggle) return;
  updateToggleIcon();
  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){ root.removeAttribute('data-theme'); localStorage.setItem('eduexpo-theme','light'); }
    else{ root.setAttribute('data-theme','dark'); localStorage.setItem('eduexpo-theme','dark'); }
    updateToggleIcon();
  });
  function updateToggleIcon(){
    toggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }
}

/* ---------- REVEAL ON SCROLL (fade-in animations) ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

/* ---------- BACK TO TOP BUTTON ---------- */
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ---------- COUNTDOWN TIMER ---------- */
function initCountdown(){
  const el = document.getElementById('countdown');
  if(!el) return;
  // Edu Expo 2026 target date — update this to the real event date
  const target = new Date('2026-09-14T08:00:00');
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-min');
  const sEl = document.getElementById('cd-sec');

  function tick(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if(dEl) dEl.textContent = String(days).padStart(2,'0');
    if(hEl) hEl.textContent = String(hours).padStart(2,'0');
    if(mEl) mEl.textContent = String(mins).padStart(2,'0');
    if(sEl) sEl.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- ANIMATED COUNTERS (stats section) ---------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-counter]');
  if(!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));

  function animateCounter(node){
    const target = parseInt(node.dataset.counter, 10);
    const duration = 1600;
    const start = performance.now();
    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.floor(eased * target).toLocaleString('id-ID');
      if(progress < 1) requestAnimationFrame(frame);
      else node.textContent = target.toLocaleString('id-ID');
    }
    requestAnimationFrame(frame);
  }
}

/* ---------- TIMELINE STEP NUMBERS ---------- */
function initTimelineNumbers(){
  document.querySelectorAll('.timeline-dot').forEach((dot, i) => {
    dot.textContent = String(i + 1).padStart(2,'0');
  });
}

/* ---------- FAQ ACCORDION ---------- */
function initFaqAccordion(){
  const items = document.querySelectorAll('.faq-item');
  if(!items.length) return;
  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });
}

/* ---------- FILTER BAR (projects / gallery categories) ---------- */
function initFilterBar(){
  const bars = document.querySelectorAll('.filter-bar');
  bars.forEach(bar => {
    const targetSelector = bar.dataset.target;
    const items = document.querySelectorAll(targetSelector);
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        items.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  });
}

/* ---------- VIRTUAL BOOTH MODAL (simulated data, no backend) ---------- */
const boothData = {
  dkv: {
    name:'DKV — Desain Komunikasi Visual',
    teacher:'Ibu Rani Prameswari, S.Ds.',
    desc:'Program keahlian yang mengasah kreativitas siswa dalam desain grafis, branding, ilustrasi, dan motion design untuk kebutuhan industri kreatif.',
    achievements:['Juara 1 Lomba Desain Poster Tingkat Provinsi 2025','Finalis Kompetisi Ilustrasi Digital Nasional','Kolaborasi proyek branding UMKM lokal'],
    projects:['Rebranding identitas visual koperasi sekolah','Seri poster kampanye lingkungan','Motion graphic profil sekolah'],
    gallery:['dkv1','dkv2','dkv3']
  },
  rpl: {
    name:'RPL — Rekayasa Perangkat Lunak',
    teacher:'Bapak Dimas Ardiansyah, S.Kom.',
    desc:'Membekali siswa dengan keterampilan pemrograman web, mobile, dan pengembangan aplikasi berbasis kebutuhan nyata dunia industri.',
    achievements:['Juara 2 Hackathon Pelajar Se-Jabodetabek','Aplikasi presensi sekolah dipakai internal','Sertifikasi kompetensi web developer'],
    projects:['Sistem informasi akademik sekolah','Aplikasi Edu Expo Redeem Photo','Website company profile UMKM mitra'],
    gallery:['rpl1','rpl2','rpl3']
  },
  tkj: {
    name:'TKJ — Teknik Komputer & Jaringan',
    teacher:'Bapak Fajar Nugroho, S.T.',
    desc:'Fokus pada instalasi jaringan, keamanan siber dasar, dan pemeliharaan infrastruktur TI untuk mencetak teknisi jaringan yang kompeten.',
    achievements:['Juara 3 Kompetisi Jaringan LKS Tingkat Kota','Sertifikasi CCNA tingkat pemula','Proyek instalasi jaringan lab sekolah'],
    projects:['Simulasi jaringan kantor mini','Konfigurasi server lokal sekolah','Monitoring jaringan berbasis dashboard'],
    gallery:['tkj1','tkj2','tkj3']
  },
  akl: {
    name:'AKL — Akuntansi & Keuangan Lembaga',
    teacher:'Ibu Sari Wulandari, S.E.',
    desc:'Melatih siswa memahami siklus akuntansi, laporan keuangan, dan perpajakan dengan pendekatan praktik langsung dan simulasi digital.',
    achievements:['Juara 1 Lomba Akuntansi Tingkat Kota','Praktik kerja lapangan di kantor akuntan publik','Simulasi laporan keuangan UMKM binaan'],
    projects:['Aplikasi pembukuan sederhana koperasi siswa','Laporan keuangan simulasi perusahaan dagang','Workshop literasi keuangan untuk siswa baru'],
    gallery:['akl1','akl2','akl3']
  },
  mplb: {
    name:'MPLB — Manajemen Perkantoran & Layanan Bisnis',
    teacher:'Ibu Nadia Kurnia, S.Pd.',
    desc:'Mengembangkan kompetensi administrasi, kearsipan, dan pelayanan bisnis modern untuk mendukung operasional perkantoran profesional.',
    achievements:['Juara 2 Lomba Kesekretarisan Tingkat Provinsi','Praktik magang di instansi pemerintahan','Pengelolaan arsip digital sekolah'],
    projects:['Sistem kearsipan digital sekolah','Simulasi pelayanan front office','Proyek humas acara sekolah'],
    gallery:['mplb1','mplb2','mplb3']
  }
};

function initBoothModal(){
  const cards = document.querySelectorAll('[data-booth]');
  const overlay = document.getElementById('booth-modal');
  if(!cards.length || !overlay) return;

  const nameEl = overlay.querySelector('#modal-name');
  const teacherEl = overlay.querySelector('#modal-teacher');
  const descEl = overlay.querySelector('#modal-desc');
  const achEl = overlay.querySelector('#modal-achievements');
  const projEl = overlay.querySelector('#modal-projects');
  const galleryEl = overlay.querySelector('#modal-gallery');
  const logoEl = overlay.querySelector('#modal-logo');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.booth;
      const data = boothData[key];
      if(!data) return;

      logoEl.textContent = key.toUpperCase();
      nameEl.textContent = data.name;
      teacherEl.textContent = 'Pengampu: ' + data.teacher;
      descEl.textContent = data.desc;

      achEl.innerHTML = data.achievements.map(a => `<li>${a}</li>`).join('');
      projEl.innerHTML = data.projects.map(p => `<li>${p}</li>`).join('');
      galleryEl.innerHTML = data.gallery.map(g =>
        `<img src="https://placehold.co/300x300/0F4C81/EAF4FF?text=${key.toUpperCase()}" alt="Dokumentasi ${data.name}" loading="lazy">`
      ).join('');

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeBoothModal);
  });
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeBoothModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeBoothModal(); });

  function closeBoothModal(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  const moreBtn = overlay.querySelector('#modal-more-btn');
  if(moreBtn){
    moreBtn.addEventListener('click', () => showToast('Menampilkan seluruh proyek jurusan...', 'success'));
  }
}

/* ---------- GALLERY LIGHTBOX ---------- */
function initGalleryLightbox(){
  const items = document.querySelectorAll('.masonry-item img');
  const lightbox = document.getElementById('lightbox');
  if(!items.length || !lightbox) return;

  const imgEl = lightbox.querySelector('img');
  let index = 0;
  const sources = Array.from(items).map(img => img.src);
  const alts = Array.from(items).map(img => img.alt);

  items.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(i){
    index = i;
    updateImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function updateImage(){
    imgEl.src = sources[index];
    imgEl.alt = alts[index];
  }
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => { index = (index + 1) % sources.length; updateImage(); });
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => { index = (index - 1 + sources.length) % sources.length; updateImage(); });
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
    if(e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
  });
  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ---------- REDEEM PHOTO PAGE ----------
   Currently reads from data/redeem.json (static, simulated).
   -----------------------------------------------------------
   BACKEND NOTE: To connect a real PHP/MySQL API later, replace
   the fetch('../data/redeem.json') call below with a call to
   your endpoint, e.g.:
     fetch('/api/redeem.php?code=' + encodeURIComponent(code))
   which should return the same JSON shape:
     { code, name, class, photos: [...] }
   and respond with a 404 / { error: 'not found' } for invalid codes.
------------------------------------------------------------- */
function initRedeemPage(){
  const form = document.getElementById('redeem-form');
  if(!form) return;

  const input = document.getElementById('redeem-code');
  const resultBox = document.getElementById('redeem-result');
  const errorBox = document.getElementById('redeem-error');
  const submitBtn = document.getElementById('redeem-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();
    resultBox.classList.remove('show');
    errorBox.classList.remove('show');

    if(!code){ showToast('Masukkan kode redeem terlebih dahulu.', 'error'); return; }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Memeriksa...';

    try{
      // Simulated "API" — reading local JSON.
      // Swap this line for a real fetch('/api/redeem.php?...') when backend is ready.
      const res = await fetch('../data/redeem.json');
      const records = await res.json();
      const record = records.find(r => r.code.toUpperCase() === code);

      await new Promise(r => setTimeout(r, 500)); // simulate network latency

      if(record){
        document.getElementById('redeem-name').textContent = record.name;
        document.getElementById('redeem-class').textContent = record.class;
        document.getElementById('redeem-initial').textContent = record.name.charAt(0);
        document.getElementById('redeem-photo-grid').innerHTML = record.photos.map(p =>
          `<img src="https://placehold.co/400x400/2F80ED/FFFFFF?text=${encodeURIComponent(p)}" alt="Foto ${record.name}" loading="lazy">`
        ).join('');
        resultBox.classList.add('show');
        showToast('Kode berhasil diredeem!', 'success');
      } else {
        errorBox.classList.add('show');
        showToast('Kode redeem tidak ditemukan.', 'error');
      }
    }catch(err){
      errorBox.classList.add('show');
      showToast('Terjadi kesalahan saat memuat data.', 'error');
    }finally{
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  const downloadBtn = document.getElementById('redeem-download');
  if(downloadBtn) downloadBtn.addEventListener('click', () => showToast('Menyiapkan unduhan foto...', 'success'));
  const shareBtn = document.getElementById('redeem-share');
  if(shareBtn) shareBtn.addEventListener('click', () => showToast('Tautan berbagi disalin ke clipboard.', 'success'));
}

/* ---------- CONTACT FORM (front-end simulation) ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Pesan berhasil dikirim. Terima kasih!', 'success');
    form.reset();
  });
}

/* ---------- LAZY LOAD IMAGES (native + fallback) ---------- */
function initLazyLoad(){
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, type = 'success'){
  const container = document.getElementById('toast-container');
  if(!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}