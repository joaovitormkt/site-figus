// =============================================================================
// FIGUS LANDING PAGE — SCRIPT.JS
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Marca que o JS carregou com sucesso
  document.documentElement.classList.add('js-loaded');

  // ---------------------------------------------------------------------------
  // PRELOADER SYSTEM — Troca dinâmica de ícones + barra de progresso
  // ---------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderIcon = document.getElementById('preloaderIcon');
  const preloaderProgress = document.getElementById('preloaderProgress');

  const preloaderIcons = [
    'cleansing.webp',
    'cleansing-_1_.webp',
    'cream.webp',
    'cream-_1_.webp',
    'serum.webp',
    'shampoo.webp'
  ];

  let currentIconIndex = 0;
  let iconInterval = null;
  let progressVal = 0;

  // Troca os ícones com um suave efeito pulse/fade
  if (preloaderIcon && preloaderIcons.length > 0) {
    iconInterval = setInterval(() => {
      preloaderIcon.style.opacity = '0';
      preloaderIcon.style.transform = 'scale(0.85)';

      setTimeout(() => {
        currentIconIndex = (currentIconIndex + 1) % preloaderIcons.length;
        preloaderIcon.src = preloaderIcons[currentIconIndex];
        preloaderIcon.style.opacity = '1';
        preloaderIcon.style.transform = 'scale(1)';
      }, 180);
    }, 420);
  }

  // Progresso simulado sincronizado
  const progressInterval = setInterval(() => {
    if (progressVal < 90) {
      progressVal += Math.floor(Math.random() * 15) + 5;
      if (progressVal > 90) progressVal = 90;
      if (preloaderProgress) preloaderProgress.style.width = progressVal + '%';
    }
  }, 120);

  function hidePreloader() {
    if (!preloader || preloader.classList.contains('is-hidden')) return;
    if (preloaderProgress) preloaderProgress.style.width = '100%';

    setTimeout(() => {
      clearInterval(iconInterval);
      clearInterval(progressInterval);
      preloader.classList.add('is-hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 600);
    }, 300);
  }

  // Desativa no window.load ou limite de 3.2s
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 3200);

  // ---------------------------------------------------------------------------
  // HEADER: Esconde ao rolar para baixo, aparece ao rolar para cima
  // ---------------------------------------------------------------------------
  const mainHeader = document.getElementById('mainHeader');
  if (mainHeader) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;

      // Classe scrolled para opacidade
      mainHeader.classList.toggle('scrolled', currentY > 60);

      // Só oculta após 100px de scroll (não oculta no topo)
      if (currentY < 100) {
        mainHeader.classList.remove('header--hidden');
      } else if (currentY > lastScrollY) {
        // Rolando para baixo — esconde
        mainHeader.classList.add('header--hidden');
      } else {
        // Rolando para cima — mostra
        mainHeader.classList.remove('header--hidden');
      }

      lastScrollY = currentY;
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // HAMBURGER MENU — Drawer lateral
  // ---------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('is-open');
    navDrawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('is-open');
    navDrawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && navDrawer && drawerOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      navDrawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });

    // Fechar ao clicar no overlay
    drawerOverlay.addEventListener('click', closeDrawer);

    // Fechar ao clicar em link do drawer e rolar suavemente para a seção
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          closeDrawer();
          // Pequeno delay para a animação de fechar terminar antes de rolar
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              const offset = mainHeader ? mainHeader.offsetHeight : 80;
              const top = target.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }, 350);
        }
      });
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  // Scroll suave também para links do nav desktop
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = mainHeader ? mainHeader.offsetHeight : 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });


  // ---------------------------------------------------------------------------
  const bgVideo = document.getElementById('bgVideo');
  const videoToggleBtn = document.getElementById('videoToggle');
  const pauseIcon = document.getElementById('pauseIcon');
  const playIcon = document.getElementById('playIcon');

  if (bgVideo && videoToggleBtn) {
    videoToggleBtn.addEventListener('click', () => {
      if (bgVideo.paused) {
        bgVideo.play();
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        videoToggleBtn.setAttribute('aria-label', 'Pausar vídeo');
      } else {
        bgVideo.pause();
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        videoToggleBtn.setAttribute('aria-label', 'Reproduzir vídeo');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. SECTION 3 VIDEO CONTROL
  // ---------------------------------------------------------------------------
  const sectionVideo = document.getElementById('sectionVideo');
  const secVideoToggleBtn = document.getElementById('sectionVideoToggle');
  const secPlayIcon = document.getElementById('secPlayIcon');
  const secPauseIcon = document.getElementById('secPauseIcon');

  if (sectionVideo && secVideoToggleBtn) {
    secVideoToggleBtn.addEventListener('click', () => {
      if (sectionVideo.paused) {
        sectionVideo.muted = false;
        sectionVideo.play().then(() => {
          secPlayIcon.style.display = 'none';
          secPauseIcon.style.display = 'block';
          secVideoToggleBtn.setAttribute('aria-label', 'Pausar vídeo');
        }).catch(err => console.log('Video play error:', err));
      } else {
        sectionVideo.pause();
        secPlayIcon.style.display = 'block';
        secPauseIcon.style.display = 'none';
        secVideoToggleBtn.setAttribute('aria-label', 'Reproduzir vídeo');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. SECTION 3: 3D TILT CARD
  // ---------------------------------------------------------------------------
  const video3dCard = document.getElementById('video3dCard');
  if (video3dCard) {
    const tiltObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    tiltObserver.observe(video3dCard);
  }

  // ---------------------------------------------------------------------------
  // 4. SECTION 4: TAB SWITCHING
  // ---------------------------------------------------------------------------
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + targetTab);
      if (panel) panel.classList.add('active');
    });
  });

  // ---------------------------------------------------------------------------
  // 5. SECTION 5: FILE INPUT
  // ---------------------------------------------------------------------------
  const formLogo = document.getElementById('formLogo');
  const fileNameDisplay = document.getElementById('fileName');
  if (formLogo && fileNameDisplay) {
    formLogo.addEventListener('change', (e) => {
      fileNameDisplay.textContent = e.target.files?.[0]?.name || 'Nenhum arquivo escolhido';
    });
  }

  // ---------------------------------------------------------------------------
  // 6. SECTION 5: PARALLAX
  // ---------------------------------------------------------------------------
  const customSection = document.getElementById('personalizacao');
  const parallaxGrid = document.getElementById('parallaxGrid');
  if (customSection && parallaxGrid) {
    window.addEventListener('scroll', () => {
      const rect = customSection.getBoundingClientRect();
      const wh = window.innerHeight;
      if (rect.top <= wh && rect.bottom >= 0) {
        const pct = (wh - rect.top) / (wh + rect.height);
        parallaxGrid.style.transform = `translateY(${(pct - 0.5) * 70}px)`;
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // 7. SCROLL REVEAL ANIMATIONS (Entrada e Saída Dinâmicas no Scroll)
  // ---------------------------------------------------------------------------
  function fadeScroll() {
    const elementos = document.querySelectorAll('.scroll-left, .scroll-right, .scroll-bottom, .scroll-top, .scale-in, [data-reveal]');
    const triggerPoint = window.innerHeight * 0.88;

    elementos.forEach((elemento) => {
      const elementoTop = elemento.getBoundingClientRect().top;
      if (elementoTop < triggerPoint) {
        elemento.classList.add('ativo');
        elemento.classList.add('is-revealed');
      } else {
        elemento.classList.remove('ativo');
        elemento.classList.remove('is-revealed');
      }
    });
  }

  window.addEventListener('scroll', fadeScroll, { passive: true });
  window.addEventListener('resize', fadeScroll, { passive: true });
  fadeScroll(); // Executa imediatamente ao carregar a página
});
