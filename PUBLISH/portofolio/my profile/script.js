// custom cursor
  const cursor = document.getElementById('cursor');
  window.addEventListener('mousemove', e=>{
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';
  });
  document.querySelectorAll('[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter', ()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave', ()=>cursor.classList.remove('hover'));
  });

  // typing / delete cycle
  const roles = ['Web Developer', 'Video Editor', 'Problem Solver'];
  const typedEl = document.getElementById('typed');
  let ri = 0, ci = 0, deleting = false;

  function tick(){
    const word = roles[ri];
    if(!deleting){
      ci++;
      typedEl.textContent = word.slice(0, ci);
      if(ci === word.length){
        deleting = true;
        setTimeout(tick, 4500);
        return;
      }
    } else {
      ci--;
      typedEl.textContent = word.slice(0, ci);
      if(ci === 0){
        deleting = false;
        ri = (ri+1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();

  // lightweight particle background across full page
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function initParticles(){
    particles = Array.from({length: 70}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.4 + 0.3,
      vy: Math.random()*0.15 + 0.03,
      o: Math.random()*0.5 + 0.1
    }));
  }
  initParticles();

  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,31,61,${p.o})`;
      ctx.fill();
      p.y -= p.vy;
      if(p.y < -5){ p.y = h+5; p.x = Math.random()*w; }
    });
    requestAnimationFrame(draw);
  }
  draw();

  // fade-up reveal on scroll (Featured Works section)
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const delay = entry.target.dataset.delay || 0;
        setTimeout(()=> entry.target.classList.add('in'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // collaboration video: play on hover, pause + reset on leave
  const collabVideo = document.getElementById('collabVideo');
  const collabCard = document.getElementById('collabCard');

  collabCard.addEventListener('mouseenter', ()=>{
    collabVideo.currentTime = 0;
    collabVideo.play().catch(()=>{});
  });
  collabCard.addEventListener('mouseleave', ()=>{
    collabVideo.pause();
  });

  // project video card: paused by default, plays on hover
  const projectVideoCard = document.getElementById('videoProjectCard');
  const projectVideo = document.getElementById('videoProject');

  if(projectVideoCard && projectVideo){
    projectVideo.pause();
    projectVideo.currentTime = 0;

    projectVideoCard.addEventListener('mouseenter', ()=>{
      projectVideo.currentTime = 0;
      projectVideo.play().catch(()=>{});
    });

    projectVideoCard.addEventListener('mouseleave', ()=>{
      projectVideo.pause();
      projectVideo.currentTime = 0;
    });
  }

  const openVideoModalBtn = document.getElementById('openVideoModal');
  const videoModal = document.getElementById('videoModal');
  const closeVideoModalBtn = document.getElementById('closeVideoModal');
  const modalVideo = document.getElementById('modalVideo');

  if(openVideoModalBtn && videoModal && closeVideoModalBtn && modalVideo){
    openVideoModalBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      modalVideo.currentTime = 0;
      modalVideo.play().catch(()=>{});
    });

    function closeVideoModal(){
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }

    closeVideoModalBtn.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e)=>{
      if(e.target === videoModal) closeVideoModal();
    });
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeVideoModal();
    });
  }

  // ===== Achievements slider + modal =====
  const certs = [
    {
      title: "Dasar Pemrograman Web",
      org: "Dicoding Indonesia",
      year: "2023",
      desc: "Sertifikat penyelesaian pelatihan dasar pengembangan web meliputi HTML, CSS, dan JavaScript untuk membangun halaman web interaktif.",
      img: "di sini"
    },
    {
      title: "Belajar Dasar Videografi",
      org: "Skill Academy",
      year: "2023",
      desc: "Pelatihan dasar produksi video mulai dari pengambilan gambar, komposisi, hingga teknik editing untuk konten digital.",
      img: "di sini"
    },
    {
      title: "Responsive Web Design",
      org: "freeCodeCamp",
      year: "2024",
      desc: "Sertifikat kelulusan kurikulum desain web responsif, mencakup flexbox, grid, dan prinsip aksesibilitas dasar.",
      img: "di sini"
    },
    {
      title: "Lomba Karya Digital Sekolah",
      org: "SMK Rekayasa Perangkat Lunak",
      year: "2024",
      desc: "Penghargaan sebagai peserta terbaik dalam kompetisi karya digital tingkat sekolah, kategori pengembangan aplikasi web.",
      img: "di sini"
    },
    {
      title: "Editing Video Tingkat Menengah",
      org: "Skill Academy",
      year: "2024",
      desc: "Pelatihan lanjutan editing video meliputi color grading, motion graphic sederhana, dan penyusunan ritme cerita visual.",
      img: "di sini"
    }
  ];

  let certCurrent = 0;
  let certAutoTimer = null;

  const certImg = document.getElementById('certImg');
  const certTitle = document.getElementById('certTitle');
  const certOrg = document.getElementById('certOrg');
  const certYear = document.getElementById('certYear');
  const certDesc = document.getElementById('certDesc');
  const idxCurrent = document.getElementById('idxCurrent');
  const idxTotal = document.getElementById('idxTotal');
  const trackFill = document.getElementById('trackFill');
  const certModal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');

  idxTotal.textContent = String(certs.length).padStart(2,'0');
  document.getElementById('certImgTag').src = certs[0].img;

  function renderCert(index, animate){
    const c = certs[index];
    if(animate){
      certImg.classList.add('fading');
      setTimeout(()=>{
        document.getElementById('certImgTag').src = c.img;
        certImg.querySelector('.ph-text').textContent = 'CERTIFICATE_IMAGE_0' + (index+1);
        certImg.classList.remove('fading');
      }, 220);
    } else {
      document.getElementById('certImgTag').src = c.img;
      certImg.querySelector('.ph-text').textContent = 'CERTIFICATE_IMAGE_0' + (index+1);
    }
    certTitle.textContent = c.title;
    certOrg.textContent = c.org;
    certYear.textContent = c.year;
    certDesc.textContent = c.desc;
    idxCurrent.textContent = String(index+1).padStart(2,'0');
    trackFill.style.width = ((index+1)/certs.length*100)+'%';
  }

  function goToCert(index, resetTimer=true){
    certCurrent = (index + certs.length) % certs.length;
    renderCert(certCurrent, true);
    if(resetTimer) restartCertAutoplay();
  }

  document.getElementById('prevBtn').addEventListener('click', ()=> goToCert(certCurrent-1));
  document.getElementById('nextBtn').addEventListener('click', ()=> goToCert(certCurrent+1));

  function restartCertAutoplay(){
    clearInterval(certAutoTimer);
    certAutoTimer = setInterval(()=> goToCert(certCurrent+1, false), 6000);
  }
  restartCertAutoplay();

  document.getElementById('certFrame').addEventListener('click', ()=>{
    document.getElementById('modalImgTag').src = certs[certCurrent].img;
    modalImg.textContent = 'CERTIFICATE_IMAGE_0' + (certCurrent+1);
    certModal.classList.add('open');
  });
  function closeCertModal(){ certModal.classList.remove('open'); }
  document.getElementById('modalClose').addEventListener('click', closeCertModal);
  certModal.addEventListener('click', (e)=>{ if(e.target === certModal) closeCertModal(); });
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeCertModal(); });

  const achHead = document.getElementById('achHead');
  const certFrame = document.getElementById('certFrame');
  const certInfo = document.getElementById('certInfo');

  const achIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        achHead.classList.add('in');
        setTimeout(()=> certFrame.classList.add('in'), 250);
        setTimeout(()=> certInfo.classList.add('in'), 500);
        achIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  achIo.observe(document.querySelector('.achieve'));

  // ===== Contact reveal =====
  const contactIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        document.getElementById('cEyebrow').classList.add('in');
        setTimeout(()=> document.getElementById('cTitle').classList.add('in'), 150);
        setTimeout(()=> document.getElementById('cDesc').classList.add('in'), 350);
        document.querySelectorAll('.c-card').forEach(card=>{
          const delay = parseInt(card.dataset.delay || 0) + 400;
          setTimeout(()=> card.classList.add('in'), delay);
        });
        contactIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  contactIo.observe(document.getElementById('contactSection'));

  // ===== Footer reveal =====
  const footerIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        document.getElementById('fDivider').classList.add('in');
        setTimeout(()=> document.getElementById('fTitle').classList.add('in'), 200);
        setTimeout(()=> document.getElementById('fDesc').classList.add('in'), 380);
        setTimeout(()=> document.getElementById('fCredit').classList.add('in'), 500);
        setTimeout(()=> document.getElementById('fClosing').classList.add('in'), 750);
        footerIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  footerIo.observe(document.getElementById('siteFooter'));