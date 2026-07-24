/* ==========================================================
   UNDANGAN DIGITAL — SCRIPT
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. SPLASH SCREEN TIMING ----------
     Animasi fade-in -> tahan 3 detik -> fade-out sekarang murni jalan
     lewat CSS (satu animation utuh di .splash-content & .splash-bg,
     total 6.4 detik). JS di sini cuma nunggu sampai animasi itu
     kelar, baru sembunyikan splash & tampilkan konten utama.
  */
  const splash = document.getElementById('splash');
  const mainContent = document.getElementById('main-content');
  const SPLASH_DURATION = 6400; // harus sama persis dengan animation di style.css

  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.add('visible');
    revealCheck(); // cek elemen yang udah kelihatan begitu halaman utama muncul
  }, SPLASH_DURATION);

  /* ---------- 2. TOMBOL "BUKA UNDANGAN" SCROLL ---------- */
  const btnScrollDown = document.getElementById('btnScrollDown');
  if (btnScrollDown) {
    btnScrollDown.addEventListener('click', () => {
      document.getElementById('pembuka').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- 3. REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
  function revealCheck() { revealEls.forEach(el => revealObserver.observe(el)); }

  /* ---------- 4. PARALLAX RINGAN DI HERO ---------- */
  const parallaxStars = document.getElementById('parallaxStars');
  if (parallaxStars && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.15;
      parallaxStars.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ---------- 5. COUNTDOWN ----------
     GANTI DI SINI: sesuaikan tanggal & jam acara
  */
  const eventDate = new Date('2026-12-20T10:00:00+07:00').getTime();

  function updateCountdown() {
    const distance = eventDate - Date.now();
    if (distance < 0) {
      document.getElementById('countdown').innerHTML = '<p>Acara telah berlangsung 🎉</p>';
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- 6. MODAL FORM UCAPAN ---------- */
  const formModal = document.getElementById('formModal');
  const btnOpenForm = document.getElementById('btnOpenForm');
  const btnCloseForm = document.getElementById('btnCloseForm');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal() { formModal.classList.remove('hidden'); }
  function closeModal() { formModal.classList.add('hidden'); }

  if (btnOpenForm) btnOpenForm.addEventListener('click', openModal);
  if (btnCloseForm) btnCloseForm.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* ---------- 7. SENSOR NAMA ----------
     Minimal tampilkan 2 huruf pertama, sisanya jadi *
     Ares -> Ar**  |  Alexander -> Al*******  |  Budi -> Bu**
  */
  function censorName(name) {
    const trimmed = name.trim();
    if (trimmed.length <= 2) return trimmed[0] + '*'.repeat(Math.max(trimmed.length - 1, 1));
    return trimmed.slice(0, 2) + '*'.repeat(trimmed.length - 2);
  }

  /* ---------- 8. FORMAT TANGGAL & JAM INDONESIA ---------- */
  function formatTanggalIndonesia(date) {
    const hariList = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    return `${hariList[date.getDay()]}, ${date.getDate()} ${bulanList[date.getMonth()]} ${date.getFullYear()}`;
  }
  function formatJamWIB(date) {
    return `${String(date.getHours()).padStart(2,'0')}.${String(date.getMinutes()).padStart(2,'0')} WIB`;
  }

  /* ---------- 9. DETEKSI DEVICE / BROWSER ---------- */
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = 'Browser Lain';
    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

    let os = 'OS Lain';
    if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';

    return `${browser} - ${os}`;
  }

  /* ---------- 10. VALIDASI + CHAR COUNTER ---------- */
  const inputNama = document.getElementById('inputNama');
  const inputPesan = document.getElementById('inputPesan');
  const countNama = document.getElementById('countNama');
  const countPesan = document.getElementById('countPesan');
  const errorNama = document.getElementById('errorNama');
  const errorPesan = document.getElementById('errorPesan');

  inputNama.addEventListener('input', () => { countNama.textContent = `${inputNama.value.length}/20`; });
  inputPesan.addEventListener('input', () => { countPesan.textContent = `${inputPesan.value.length}/150`; });

  function showFieldError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
  function hideFieldError(el) { el.classList.add('hidden'); }

  function validateForm() {
    let valid = true;
    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (!nama) { showFieldError(errorNama, 'Nama wajib diisi.'); valid = false; }
    else if (nama.length > 20) { showFieldError(errorNama, 'Nama maksimal 20 karakter.'); valid = false; }
    else hideFieldError(errorNama);

    if (!pesan) { showFieldError(errorPesan, 'Pesan wajib diisi.'); valid = false; }
    else if (pesan.length > 150) { showFieldError(errorPesan, 'Pesan maksimal 150 karakter.'); valid = false; }
    else hideFieldError(errorPesan);

    return valid;
  }

  /* ---------- 11. KIRIM UCAPAN KE FIRESTORE ---------- */
  const ucapanForm = document.getElementById('ucapanForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const formError = document.getElementById('formError');

  ucapanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');

    if (!validateForm()) return;

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();
    const now = new Date();

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Mengirim...';

    try {
      await db.collection('ucapan').add({
        nama: nama,
        namaSensor: censorName(nama),
        pesan: pesan,
        tanggal: formatTanggalIndonesia(now),
        jam: formatJamWIB(now),
        device: getDeviceInfo(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      ucapanForm.reset();
      countNama.textContent = '0/20';
      countPesan.textContent = '0/150';
      closeModal();

      // balik ke halaman utama (hero) setelah kirim
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Gagal mengirim ucapan:', err);
      formError.textContent = 'Gagal mengirim ucapan. Coba lagi ya.';
      formError.classList.remove('hidden');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Kirim Ucapan';
    }
  });

  /* ---------- 12. TAMPILKAN UCAPAN REAL-TIME (terbaru dulu) ---------- */
  const commentsList = document.getElementById('commentsList');
  const commentsStatus = document.getElementById('commentsStatus');

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  db.collection('ucapan')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        commentsStatus.textContent = 'Jadi yang pertama memberi ucapan!';
        commentsStatus.classList.remove('hidden');
        commentsList.innerHTML = '';
        return;
      }

      commentsStatus.classList.add('hidden');
      commentsList.innerHTML = '';

      snapshot.forEach((doc) => {
        const data = doc.data();
        // fallback kalau field lama (sebelum ada namaSensor) masih ada di database
        const namaSensor = data.namaSensor || censorName(data.nama || '');

        const card = document.createElement('div');
        card.className = 'comment-card reveal visible';
        card.innerHTML = `
          <p class="comment-name">${escapeHTML(namaSensor)}</p>
          <p class="comment-message">${escapeHTML(data.pesan || '')}</p>
          <div class="comment-meta">
            <span>${escapeHTML(data.tanggal || '')}</span>
            <span>${escapeHTML(data.jam || '')}</span>
            <span>${escapeHTML(data.device || '')}</span>
          </div>
        `;
        commentsList.appendChild(card);
      });
    }, (err) => {
      console.error('Gagal memuat ucapan:', err);
      commentsStatus.textContent = 'Gagal memuat ucapan. Pastikan Firebase sudah dikonfigurasi.';
      commentsStatus.classList.remove('hidden');
    });

});