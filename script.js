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
  // 2. SECTION 3 VIDEO COVER & PLAY TRIGGER
  // ---------------------------------------------------------------------------
  const videoCover = document.getElementById('videoCover');
  const vimeoPlayer = document.getElementById('vimeoPlayer');

  if (videoCover && vimeoPlayer) {
    const playVideo = () => {
      videoCover.classList.add('is-hidden');
      let src = vimeoPlayer.getAttribute('src') || '';
      if (!src.includes('autoplay=1')) {
        src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
        vimeoPlayer.setAttribute('src', src);
      }
    };

    videoCover.addEventListener('click', playVideo);
    videoCover.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
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
  // 5. SECTION 5: FILE INPUT & FORM SUBMISSION (figus@figus.com.br)
  // ---------------------------------------------------------------------------
  const mockupForm = document.getElementById('mockupForm');
  const formLogo = document.getElementById('formLogo');
  const fileNameDisplay = document.getElementById('fileName');
  const mockupFeedback = document.getElementById('mockupFeedback');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (formLogo && fileNameDisplay) {
    formLogo.addEventListener('change', (e) => {
      fileNameDisplay.textContent = e.target.files?.[0]?.name || 'Nenhum arquivo escolhido';
    });
  }

  if (mockupForm && mockupFeedback && formSubmitBtn) {
    mockupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const currentLang = localStorage.getItem('figus-lang') || 'pt';
      const dict = translations[currentLang] || translations.pt;

      const originalBtnText = formSubmitBtn.textContent;
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = dict['s5.form.sending'] || 'Enviando...';
      mockupFeedback.style.display = 'none';
      mockupFeedback.className = 'form-feedback';

      try {
        const formData = new FormData(mockupForm);
        const response = await fetch('https://formsubmit.co/ajax/figus@figus.com.br', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          mockupFeedback.textContent = dict['s5.form.success'] || 'Solicitação enviada com sucesso! Em breve entraremos em contato.';
          mockupFeedback.classList.add('is-success');
          mockupFeedback.style.display = 'block';
          mockupForm.reset();
          if (fileNameDisplay) fileNameDisplay.textContent = dict['s5.form.nofile'] || 'Nenhum arquivo escolhido';
        } else {
          throw new Error('Falha no envio');
        }
      } catch (err) {
        mockupFeedback.textContent = dict['s5.form.error'] || 'Ocorreu um erro ao enviar. Por favor, tente novamente.';
        mockupFeedback.classList.add('is-error');
        mockupFeedback.style.display = 'block';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = originalBtnText;
      }
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

  // ---------------------------------------------------------------------------
  // 8. LANGUAGE SWITCHER — PT / EN / ES
  // ---------------------------------------------------------------------------
  const translations = {
    pt: {
      // Nav
      'nav.home': 'Início', 'nav.solutions': 'Soluções', 'nav.market': 'Mercado',
      'nav.custom': 'Personalização', 'nav.contact': 'Contato',
      // Hero
      'hero.title': 'Crie sua própria marca de cosméticos sem precisar de fábrica, estoque ou experiência.',
      'hero.desc': 'Desenvolvemos, produzimos e enviamos enquanto você constrói sua marca e vende, sem se preocupar com produção ou logística.',
      'hero.cta1': 'Fale conosco', 'hero.cta2': 'Saiba Mais',
      // Global CTA
      'cta.talk': 'Fale conosco',
      // Marquee
      'mq.1': 'Marca Própria •', 'mq.2': 'Sem Fábrica •', 'mq.3': 'Sem Estoque •', 'mq.4': 'Alta Margem •',
      'mq.5': 'Produção Completa •', 'mq.6': 'Logística Integrada •', 'mq.7': 'Pronto para Vender •', 'mq.8': 'Escala com Simplicidade •',
      // S2
      's2.badge': 'NUNCA FOI SÓ UM FÁBRICA',
      's2.title': 'A estrutura completa para você criar, lançar e escalar sua própria marca de cosméticos.',
      's2.subtitle': 'Se você já vende, atende clientes ou acompanha o mercado de beleza, provavelmente já percebeu: construir uma marca própria é o próximo passo natural para crescer, aumentar sua margem e ter controle real sobre o seu negócio.',
      's2.card1.title': 'Não é só um White Label', 's2.card1.text': 'Produção personalizada com fórmulas exclusivas para sua marca ser única.',
      's2.card2.title': 'Baixo MOQ', 's2.card2.text': 'Baixa quantidade mínima de produtos para você começar mais rápido.',
      's2.card3.title': 'Velocidade de Produção', 's2.card3.text': 'Fábrica e laboratório próprios para acelerar o seu processo de lançamento.',
      's2.card4.title': 'Logística Integrada', 's2.card4.text': 'Da produção até a entrega para o seu cliente final, cuidamos de tudo pra você.',
      's2.footer': 'Você não precisa de fábrica, equipe ou conhecimento técnico para começar. Nós já temos toda a estrutura pronta para desenvolver, produzir e enviar seus produtos. O que você precisa agora é dar o próximo passo.',
      // S3
      's3.badge': 'O MERCADO ESTÁ CRESCENDO',
      's3.title': 'Você vai participar\nou só assistir?',
      's3.desc': 'O Brasil está entre os maiores mercados de cosméticos do planeta, com crescimento consistente mesmo em cenários econômicos desafiadores. O avanço das marcas independentes, influenciadores e vendas digitais abriu espaço para novos empreendedores entrarem com força sem precisar de grandes estruturas.',
      's3.stat1.sub': 'maior mercado de beleza do mundo', 's3.stat1.text': 'O Brasil ocupa posição de destaque global no consumo de cosméticos, fragrâncias e higiene pessoal.',
      's3.stat2.sub': 'bilhões por ano', 's3.stat2.text': 'O setor movimenta mais de R$130 bilhões anuais, com crescimento contínuo impulsionado por inovação e demanda recorrente.',
      's3.stat3.sub': 'crescimento anual', 's3.stat3.text': 'O setor de beleza no Brasil apresentou crescimento próximo de dois dígitos recentemente, mesmo diante de cenários econômicos instáveis.',
      's3.footer': 'Agora que você entende como funciona, é simples: clique no botão e dê o primeiro passo para lançar a sua marca.',
      // S4
      's4.badge': 'PROCESSO DE PONTA A PONTA',
      's4.title': 'Tudo o que você precisa para lançar e escalar sua marca, em um só lugar',
      's4.desc': 'Da criação dos produtos até a entrega final ao cliente, integramos todas as etapas para que você não precise se preocupar com operação, fornecedores ou processos complexos.',
      's4.tab1': 'Desenvolvimento', 's4.tab2': 'Produção', 's4.tab3': 'Venda', 's4.tab4': 'Logística',
      's4.p1.title': 'Sua marca começa aqui', 's4.p1.desc': 'Transformamos sua ideia em produtos reais, com formulações pensadas para o seu público e posicionamento de marca.',
      's4.p1.li1': 'Criação de fórmulas alinhadas ao seu público', 's4.p1.li2': 'Possibilidade de personalização da linha', 's4.p1.li3': 'Apoio técnico sem necessidade de conhecimento prévio',
      's4.p2.title': 'Qualidade profissional sem estrutura própria', 's4.p2.desc': 'Cuidamos de toda a fabricação dos seus produtos com padrão profissional, garantindo qualidade, consistência e segurança.',
      's4.p2.li1': 'Produção com controle de qualidade', 's4.p2.li2': 'Escala conforme o crescimento da sua marca', 's4.p2.li3': 'Sem necessidade de estrutura própria',
      's4.p3.title': 'Foque no crescimento, não na operação', 's4.p3.desc': 'Você foca em construir sua marca e vender, enquanto toda a base operacional já está pronta para sustentar seu crescimento.',
      's4.p3.li1': 'Liberdade para focar em marketing e vendas', 's4.p3.li2': 'Mais controle sobre preço e margem', 's4.p3.li3': 'Marca própria fortalecendo sua autoridade',
      's4.p4.title': 'Entrega eficiente sem complicação', 's4.p4.desc': 'Armazenamos e enviamos seus produtos diretamente para o cliente, garantindo agilidade e uma experiência profissional.',
      's4.p4.li1': 'Envio direto ao consumidor final', 's4.p4.li2': 'Redução de custos e complexidade logística', 's4.p4.li3': 'Operação pronta para escalar',
      's4.footer': 'Se você quer sair da ideia e realmente colocar sua marca no mercado, essa é a forma mais simples e segura de fazer isso hoje. Fale com nosso time e descubra como lançar sua marca de cosméticos.',
      // S5
      's5.badge': 'PERSONALIZAÇÃO', 's5.title': 'Quer ver como o seu produto ficaria na prática?',
      's5.desc': 'Preencha o formulário abaixo e envie sua logo para nós. Nossa equipe irá criar um mockup personalizado pra você.',
      's5.form.name': 'Nome', 's5.form.color': 'Cor principal', 's5.form.logo': 'Sua logo',
      's5.form.choose': 'Escolher arquivo', 's5.form.nofile': 'Nenhum arquivo escolhido', 's5.form.submit': 'Enviar',
      's5.form.sending': 'Enviando...', 's5.form.success': 'Solicitação enviada com sucesso! Em breve entraremos em contato.', 's5.form.error': 'Ocorreu um erro ao enviar. Por favor, tente novamente.',
      // S6
      's6.badge': 'SUA MARCA, DO SEU JEITO', 's6.title': 'Você imagina, a gente transforma em produto.',
      's6.subtitle': 'Desenvolvemos cosméticos sob medida para a sua marca, da ideia à fórmula final.',
      's6.footer': 'Você não precisa adaptar seu sonho a um catálogo pronto. Aqui, o produto nasce com a sua identidade, seu público e seu posicionamento.',
      // S7
      's7.badge': 'COMO FUNCIONA', 's7.title': 'Criar sua própria linha de cosméticos é mais simples do que parece',
      's7.subtitle': 'Nós cuidamos de todo o processo, do conceito à produção. Você foca na sua marca, enquanto a gente transforma sua ideia em um produto pronto para o mercado.',
      's7.step1.title': 'Apresente a sua ideia', 's7.step1.text': 'Preencha o formulário especificando o que você pretende atender em público e objetivos. Com essas informações, conseguimos entender exatamente o que você quer construir.',
      's7.step2.title': 'Desenvolvemos sua fórmula e conceito', 's7.step2.text': 'Nossa equipe cria uma proposta personalizada com formulação, características do produto e direcionamento da sua linha.',
      's7.step3.title': 'Produção e entrega da sua marca', 's7.step3.text': 'Após aprovação, iniciamos a produção e entregamos seu produto pronto para venda, com qualidade e padrão profissional.',
      's7.footer': 'Se você quer sair da ideia e realmente colocar sua marca no mercado, essa é a forma mais simples e segura de fazer isso hoje. Fale com nosso time e descubra como lançar sua marca de cosméticos.',
      // S8
      's8.badge': 'COMECE AGORA MESMO', 's8.title': 'Sua própria linha de cosméticos completa',
      's8.desc': 'Desenvolvemos diferentes tipos de produtos para que você possa construir uma marca sólida, alinhada ao seu público e pronta para crescer.',
      // S9
      's9.badge': 'COMECE SUA MARCA AGORA', 's9.title': 'Dê o primeiro passo para criar sua marca de cosméticos',
      's9.desc': 'Preencha o formulário e nossa equipe vai te mostrar como transformar sua ideia em uma marca pronta para vender.',
      's9.notice': 'Nosso mínimo de produção é a partir de <strong>300 unidades</strong> por cada produto.',
      // S10 FAQ
      's10.title': 'Perguntas Frequentes', 's10.subtitle': 'Sabemos que começar algo novo gera dúvidas, por isso reunimos aqui as principais respostas para te ajudar a entender como tudo funciona.',
      's10.q1': 'Preciso ter experiência com cosméticos para começar?', 's10.a1': 'Não. Você não precisa de conhecimento técnico ou experiência na área. Nós cuidamos de todo o desenvolvimento e produção, enquanto você foca na construção da sua marca e nas vendas.',
      's10.q2': 'Preciso já ter uma marca definida?', 's10.a2': 'Não necessariamente. Você pode chegar apenas com uma ideia inicial, e nós te ajudamos a estruturar os produtos de acordo com o público e o posicionamento que deseja construir.',
      's10.q3': 'É necessário um grande investimento para começar?', 's10.a3': 'Não. Hoje existem modelos mais acessíveis que permitem começar sem precisar montar fábrica ou investir em grandes estruturas. O investimento depende do tipo de produto e da escala inicial.',
      's10.q4': 'Posso personalizar os produtos ou são todos iguais?', 's10.a4': 'Sim, os produtos são desenvolvidos de forma personalizada. As fórmulas, características e proposta podem ser adaptadas para refletir a identidade da sua marca.',
      's10.q5': 'Como funciona a entrega dos produtos?', 's10.a5': 'Nós cuidamos de toda a parte logística. Os produtos podem ser enviados diretamente para você ou para o cliente final, facilitando a operação e permitindo que você escale sem se preocupar com envio.',
      's10.q6': 'Em quanto tempo posso começar a vender?', 's10.a6': 'O prazo pode variar de acordo com o tipo de produto e nível de personalização, mas todo o processo é estruturado para ser ágil e permitir que você lance sua marca no menor tempo possível.',
      's10.faq_footer_title': 'Ainda tem dúvidas?', 's10.faq_footer_text': 'Toque no botão abaixo e <strong>entre</strong> em contato.', 's10.faq_footer_cta': 'Falar com especialista',
      // Footer
      'footer.copy': 'Todos os direitos reservados Figus®',
    },
    en: {
      'nav.home': 'Home', 'nav.solutions': 'Solutions', 'nav.market': 'Market',
      'nav.custom': 'Customization', 'nav.contact': 'Contact',
      'hero.title': 'Create your own cosmetics brand without needing a factory, stock or experience.',
      'hero.desc': 'We develop, produce and ship while you build your brand and sell, without worrying about production or logistics.',
      'hero.cta1': 'Talk to us', 'hero.cta2': 'Learn More',
      'cta.talk': 'Talk to us',
      // Marquee
      'mq.1': 'Private Label •', 'mq.2': 'No Factory •', 'mq.3': 'No Stock •', 'mq.4': 'High Margin •',
      'mq.5': 'Full Production •', 'mq.6': 'Integrated Logistics •', 'mq.7': 'Ready to Sell •', 'mq.8': 'Scale with Simplicity •',
      's2.badge': 'NEVER JUST A FACTORY',
      's2.title': 'The complete structure to create, launch and scale your own cosmetics brand.',
      's2.subtitle': 'If you already sell, serve clients or follow the beauty market, you\'ve probably realized: building your own brand is the natural next step to grow, increase your margin and have real control over your business.',
      's2.card1.title': 'Not just White Label', 's2.card1.text': 'Custom production with exclusive formulas so your brand stands out.',
      's2.card2.title': 'Low MOQ', 's2.card2.text': 'Low minimum order quantity so you can start faster.',
      's2.card3.title': 'Production Speed', 's2.card3.text': 'Own factory and laboratory to speed up your launch process.',
      's2.card4.title': 'Integrated Logistics', 's2.card4.text': 'From production to delivery to your end customer, we handle everything for you.',
      's2.footer': 'You don\'t need a factory, team or technical knowledge to start. We already have the entire structure ready to develop, produce and ship your products. What you need now is to take the next step.',
      's3.badge': 'THE MARKET IS GROWING',
      's3.title': 'Will you participate\nor just watch?',
      's3.desc': 'Brazil is among the largest cosmetics markets on the planet, with consistent growth even in challenging economic scenarios. The rise of independent brands, influencers and digital sales has opened space for new entrepreneurs to enter with strength without needing large structures.',
      's3.stat1.sub': 'largest beauty market in the world', 's3.stat1.text': 'Brazil holds a prominent global position in the consumption of cosmetics, fragrances and personal hygiene.',
      's3.stat2.sub': 'billion per year', 's3.stat2.text': 'The sector moves more than R$130 billion annually, with continuous growth driven by innovation and recurring demand.',
      's3.stat3.sub': 'annual growth', 's3.stat3.text': 'The beauty sector in Brazil showed growth close to double digits recently, even amid unstable economic scenarios.',
      's3.footer': 'Now that you understand how it works, it\'s simple: click the button and take the first step to launch your brand.',
      's4.badge': 'END-TO-END PROCESS',
      's4.title': 'Everything you need to launch and scale your brand, in one place',
      's4.desc': 'From product creation to final delivery to the customer, we integrate all stages so you don\'t have to worry about operations, suppliers or complex processes.',
      's4.tab1': 'Development', 's4.tab2': 'Production', 's4.tab3': 'Sales', 's4.tab4': 'Logistics',
      's4.p1.title': 'Your brand starts here', 's4.p1.desc': 'We turn your idea into real products, with formulations designed for your audience and brand positioning.',
      's4.p1.li1': 'Formula creation aligned to your audience', 's4.p1.li2': 'Possibility of line customization', 's4.p1.li3': 'Technical support without prior knowledge required',
      's4.p2.title': 'Professional quality without your own structure', 's4.p2.desc': 'We handle all manufacturing of your products with professional standards, ensuring quality, consistency and safety.',
      's4.p2.li1': 'Production with quality control', 's4.p2.li2': 'Scale as your brand grows', 's4.p2.li3': 'No need for your own structure',
      's4.p3.title': 'Focus on growth, not operations', 's4.p3.desc': 'You focus on building your brand and selling, while the entire operational base is ready to support your growth.',
      's4.p3.li1': 'Freedom to focus on marketing and sales', 's4.p3.li2': 'More control over price and margin', 's4.p3.li3': 'Own brand strengthening your authority',
      's4.p4.title': 'Efficient delivery without complications', 's4.p4.desc': 'We store and ship your products directly to the customer, ensuring agility and a professional experience.',
      's4.p4.li1': 'Direct shipping to end consumer', 's4.p4.li2': 'Cost and logistical complexity reduction', 's4.p4.li3': 'Operation ready to scale',
      's4.footer': 'If you want to move from idea to actually putting your brand on the market, this is the simplest and safest way to do it today. Talk to our team and find out how to launch your cosmetics brand.',
      's5.badge': 'CUSTOMIZATION', 's5.title': 'Want to see how your product would look in practice?',
      's5.desc': 'Fill out the form below and send us your logo. Our team will create a personalized mockup for you.',
      's5.form.name': 'Name', 's5.form.color': 'Main color', 's5.form.logo': 'Your logo',
      's5.form.choose': 'Choose file', 's5.form.nofile': 'No file chosen', 's5.form.submit': 'Submit',
      's5.form.sending': 'Sending...', 's5.form.success': 'Request sent successfully! We will contact you soon.', 's5.form.error': 'An error occurred while sending. Please try again.',
      's6.badge': 'YOUR BRAND, YOUR WAY', 's6.title': 'You imagine it, we turn it into a product.',
      's6.subtitle': 'We develop custom cosmetics for your brand, from idea to final formula.',
      's6.footer': 'You don\'t need to adapt your dream to a ready-made catalog. Here, the product is born with your identity, your audience and your positioning.',
      's7.badge': 'HOW IT WORKS', 's7.title': 'Creating your own cosmetics line is simpler than it seems',
      's7.subtitle': 'We handle the entire process, from concept to production. You focus on your brand while we turn your idea into a market-ready product.',
      's7.step1.title': 'Present your idea', 's7.step1.text': 'Fill out the form specifying what audience and goals you want to serve. With this information, we understand exactly what you want to build.',
      's7.step2.title': 'We develop your formula and concept', 's7.step2.text': 'Our team creates a personalized proposal with formulation, product characteristics and direction for your line.',
      's7.step3.title': 'Production and delivery of your brand', 's7.step3.text': 'After approval, we start production and deliver your product ready for sale, with professional quality and standards.',
      's7.footer': 'If you want to move from idea to actually putting your brand on the market, this is the simplest and safest way to do it today. Talk to our team and find out how to launch your cosmetics brand.',
      's8.badge': 'START RIGHT NOW', 's8.title': 'Your own complete cosmetics line',
      's8.desc': 'We develop different types of products so you can build a solid brand, aligned to your audience and ready to grow.',
      's9.badge': 'START YOUR BRAND NOW', 's9.title': 'Take the first step to create your cosmetics brand',
      's9.desc': 'Fill out the form and our team will show you how to turn your idea into a brand ready to sell.',
      's9.notice': 'Our minimum production starts from <strong>300 units</strong> per product.',
      's10.title': 'Frequently Asked Questions', 's10.subtitle': 'We know that starting something new raises questions, so we\'ve gathered the main answers to help you understand how everything works.',
      's10.q1': 'Do I need experience with cosmetics to start?', 's10.a1': 'No. You don\'t need technical knowledge or experience in the field. We handle all development and production, while you focus on building your brand and sales.',
      's10.q2': 'Do I need to already have a defined brand?', 's10.a2': 'Not necessarily. You can come with just an initial idea, and we help you structure the products according to the audience and positioning you want to build.',
      's10.q3': 'Is a large investment required to start?', 's10.a3': 'No. Today there are more accessible models that allow you to start without needing to set up a factory or invest in large structures. The investment depends on the type of product and initial scale.',
      's10.q4': 'Can I customize the products or are they all the same?', 's10.a4': 'Yes, products are developed in a personalized way. Formulas, characteristics and proposal can be adapted to reflect your brand\'s identity.',
      's10.q5': 'How does product delivery work?', 's10.a5': 'We handle all logistics. Products can be shipped directly to you or to the end customer, making operations easier and allowing you to scale without worrying about shipping.',
      's10.q6': 'How long until I can start selling?', 's10.a6': 'The timeline can vary according to the type of product and level of customization, but the entire process is structured to be agile and allow you to launch your brand in the shortest time possible.',
      's10.faq_footer_title': 'Still have questions?', 's10.faq_footer_text': 'Tap the button below and <strong>get in</strong> touch.', 's10.faq_footer_cta': 'Talk to a specialist',
      'footer.copy': 'All rights reserved Figus®',
    },
    es: {
      'nav.home': 'Inicio', 'nav.solutions': 'Soluciones', 'nav.market': 'Mercado',
      'nav.custom': 'Personalización', 'nav.contact': 'Contacto',
      'hero.title': 'Crea tu propia marca de cosméticos sin necesitar fábrica, stock ni experiencia.',
      'hero.desc': 'Desarrollamos, producimos y enviamos mientras tú construyes tu marca y vendes, sin preocuparte por la producción ni la logística.',
      'hero.cta1': 'Habla con nosotros', 'hero.cta2': 'Saber más',
      'cta.talk': 'Habla con nosotros',
      // Marquee
      'mq.1': 'Marca Propia •', 'mq.2': 'Sin Fábrica •', 'mq.3': 'Sin Stock •', 'mq.4': 'Alto Margen •',
      'mq.5': 'Producción Completa •', 'mq.6': 'Logística Integrada •', 'mq.7': 'Listo para Vender •', 'mq.8': 'Escala con Simplicidad •',
      's2.badge': 'NUNCA FUE SOLO UNA FÁBRICA',
      's2.title': 'La estructura completa para crear, lanzar y escalar tu propia marca de cosméticos.',
      's2.subtitle': 'Si ya vendes, atiendes clientes o sigues el mercado de belleza, probablemente ya notaste: construir una marca propia es el próximo paso natural para crecer, aumentar tu margen y tener control real sobre tu negocio.',
      's2.card1.title': 'No es solo White Label', 's2.card1.text': 'Producción personalizada con fórmulas exclusivas para que tu marca sea única.',
      's2.card2.title': 'MOQ Bajo', 's2.card2.text': 'Cantidad mínima de pedido baja para que puedas empezar más rápido.',
      's2.card3.title': 'Velocidad de Producción', 's2.card3.text': 'Fábrica y laboratorio propios para acelerar tu proceso de lanzamiento.',
      's2.card4.title': 'Logística Integrada', 's2.card4.text': 'De la producción a la entrega a tu cliente final, nos encargamos de todo.',
      's2.footer': 'No necesitas fábrica, equipo ni conocimiento técnico para empezar. Ya tenemos toda la estructura lista para desarrollar, producir y enviar tus productos. Lo que necesitas ahora es dar el próximo paso.',
      's3.badge': 'EL MERCADO ESTÁ CRECIENDO',
      's3.title': '¿Vas a participar\no solo mirar?',
      's3.desc': 'Brasil está entre los mayores mercados de cosméticos del planeta, con crecimiento constante incluso en escenarios económicos desafiantes. El avance de las marcas independientes, influencers y ventas digitales abrió espacio para nuevos emprendedores.',
      's3.stat1.sub': 'mayor mercado de belleza del mundo', 's3.stat1.text': 'Brasil ocupa una posición destacada a nivel global en el consumo de cosméticos, fragancias e higiene personal.',
      's3.stat2.sub': 'mil millones por año', 's3.stat2.text': 'El sector mueve más de R$130 mil millones anuales, con crecimiento continuo impulsado por innovación y demanda recurrente.',
      's3.stat3.sub': 'crecimiento anual', 's3.stat3.text': 'El sector de belleza en Brasil mostró un crecimiento cercano a dos dígitos recientemente, incluso ante escenarios económicos inestables.',
      's3.footer': 'Ahora que entiendes cómo funciona, es simple: haz clic en el botón y da el primer paso para lanzar tu marca.',
      's4.badge': 'PROCESO DE PRINCIPIO A FIN',
      's4.title': 'Todo lo que necesitas para lanzar y escalar tu marca, en un solo lugar',
      's4.desc': 'Desde la creación de productos hasta la entrega final al cliente, integramos todas las etapas para que no tengas que preocuparte por operaciones, proveedores o procesos complejos.',
      's4.tab1': 'Desarrollo', 's4.tab2': 'Producción', 's4.tab3': 'Ventas', 's4.tab4': 'Logística',
      's4.p1.title': 'Tu marca empieza aquí', 's4.p1.desc': 'Transformamos tu idea en productos reales, con formulaciones pensadas para tu público y posicionamiento de marca.',
      's4.p1.li1': 'Creación de fórmulas alineadas a tu público', 's4.p1.li2': 'Posibilidad de personalización de la línea', 's4.p1.li3': 'Apoyo técnico sin conocimiento previo requerido',
      's4.p2.title': 'Calidad profesional sin estructura propia', 's4.p2.desc': 'Nos encargamos de toda la fabricación con estándares profesionales, garantizando calidad, consistencia y seguridad.',
      's4.p2.li1': 'Producción con control de calidad', 's4.p2.li2': 'Escala según el crecimiento de tu marca', 's4.p2.li3': 'Sin necesidad de estructura propia',
      's4.p3.title': 'Enfócate en el crecimiento, no en la operación', 's4.p3.desc': 'Tú te enfocas en construir tu marca y vender, mientras toda la base operacional está lista para sostener tu crecimiento.',
      's4.p3.li1': 'Libertad para enfocarte en marketing y ventas', 's4.p3.li2': 'Más control sobre precio y margen', 's4.p3.li3': 'Marca propia fortaleciendo tu autoridad',
      's4.p4.title': 'Entrega eficiente sin complicaciones', 's4.p4.desc': 'Almacenamos y enviamos tus productos directamente al cliente, garantizando agilidad y una experiencia profesional.',
      's4.p4.li1': 'Envío directo al consumidor final', 's4.p4.li2': 'Reducción de costos y complejidad logística', 's4.p4.li3': 'Operación lista para escalar',
      's4.footer': 'Si quieres pasar de la idea a poner realmente tu marca en el mercado, esta es la forma más simple y segura de hacerlo hoy. Habla con nuestro equipo y descubre cómo lanzar tu marca de cosméticos.',
      's5.badge': 'PERSONALIZACIÓN', 's5.title': '¿Quieres ver cómo quedaría tu producto en la práctica?',
      's5.desc': 'Rellena el formulario y envíanos tu logo. Nuestro equipo creará un mockup personalizado para ti.',
      's5.form.name': 'Nombre', 's5.form.color': 'Color principal', 's5.form.logo': 'Tu logo',
      's5.form.choose': 'Elegir archivo', 's5.form.nofile': 'Ningún archivo seleccionado', 's5.form.submit': 'Enviar',
      's5.form.sending': 'Enviando...', 's5.form.success': '¡Solicitud enviada con éxito! Pronto nos pondremos en contacto.', 's5.form.error': 'Ocurrió un error al enviar. Por favor, inténtelo de nuevo.',
      's6.badge': 'TU MARCA, A TU MANERA', 's6.title': 'Tú lo imaginas, nosotros lo convertimos en producto.',
      's6.subtitle': 'Desarrollamos cosméticos a medida para tu marca, de la idea a la fórmula final.',
      's6.footer': 'No necesitas adaptar tu sueño a un catálogo listo. Aquí, el producto nace con tu identidad, tu público y tu posicionamiento.',
      's7.badge': 'CÓMO FUNCIONA', 's7.title': 'Crear tu propia línea de cosméticos es más simple de lo que parece',
      's7.subtitle': 'Nos encargamos de todo el proceso, del concepto a la producción. Tú te enfocas en tu marca mientras nosotros convertimos tu idea en un producto listo para el mercado.',
      's7.step1.title': 'Presenta tu idea', 's7.step1.text': 'Rellena el formulario especificando qué público y objetivos quieres atender. Con esa información, entendemos exactamente lo que quieres construir.',
      's7.step2.title': 'Desarrollamos tu fórmula y concepto', 's7.step2.text': 'Nuestro equipo crea una propuesta personalizada con formulación, características del producto y dirección para tu línea.',
      's7.step3.title': 'Producción y entrega de tu marca', 's7.step3.text': 'Tras la aprobación, iniciamos la producción y entregamos tu producto listo para venta, con calidad y estándares profesionales.',
      's7.footer': 'Si quieres pasar de la idea a poner realmente tu marca en el mercado, esta es la forma más simple y segura de hacerlo hoy.',
      's8.badge': 'EMPIEZA AHORA MISMO', 's8.title': 'Tu propia línea de cosméticos completa',
      's8.desc': 'Desarrollamos diferentes tipos de productos para que puedas construir una marca sólida, alineada a tu público y lista para crecer.',
      's9.badge': 'EMPIEZA TU MARCA AHORA', 's9.title': 'Da el primer paso para crear tu marca de cosméticos',
      's9.desc': 'Rellena el formulario y nuestro equipo te mostrará cómo convertir tu idea en una marca lista para vender.',
      's9.notice': 'Nuestro mínimo de producción es a partir de <strong>300 unidades</strong> por producto.',
      's10.title': 'Preguntas Frecuentes', 's10.subtitle': 'Sabemos que empezar algo nuevo genera dudas, por eso reunimos aquí las principales respuestas para ayudarte a entender cómo funciona todo.',
      's10.q1': '¿Necesito experiencia con cosméticos para empezar?', 's10.a1': 'No. No necesitas conocimiento técnico ni experiencia en el área. Nosotros nos encargamos de todo el desarrollo y producción, mientras tú te enfocas en construir tu marca y en las ventas.',
      's10.q2': '¿Necesito tener una marca definida?', 's10.a2': 'No necesariamente. Puedes llegar solo con una idea inicial, y te ayudamos a estructurar los productos según el público y el posicionamiento que deseas construir.',
      's10.q3': '¿Se necesita una gran inversión para empezar?', 's10.a3': 'No. Hoy existen modelos más accesibles que permiten empezar sin necesitar montar una fábrica ni invertir en grandes estructuras. La inversión depende del tipo de producto y la escala inicial.',
      's10.q4': '¿Puedo personalizar los productos?', 's10.a4': 'Sí, los productos se desarrollan de forma personalizada. Las fórmulas, características y propuesta pueden adaptarse para reflejar la identidad de tu marca.',
      's10.q5': '¿Cómo funciona la entrega de los productos?', 's10.a5': 'Nos encargamos de toda la logística. Los productos pueden enviarse directamente a ti o al cliente final, facilitando la operación y permitiendo que escales sin preocuparte por el envío.',
      's10.q6': '¿En cuánto tiempo puedo empezar a vender?', 's10.a6': 'El plazo puede variar según el tipo de producto y el nivel de personalización, pero todo el proceso está estructurado para ser ágil y permitirte lanzar tu marca en el menor tiempo posible.',
      's10.faq_footer_title': '¿Aún tienes dudas?', 's10.faq_footer_text': 'Toca el botón de abajo y <strong>contáctanos</strong>.', 's10.faq_footer_cta': 'Hablar con un especialista',
      'footer.copy': 'Todos los derechos reservados Figus®',
    }
  };


  const langMap = { pt: 'pt-BR', en: 'en', es: 'es' };

  function applyLang(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Update html[lang]
    const htmlRoot = document.getElementById('htmlRoot');
    if (htmlRoot) htmlRoot.setAttribute('lang', langMap[lang] || lang);

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (val === undefined) return;

      // For buttons/links that contain an SVG, keep SVG and update text
      const svg = el.querySelector('svg');
      if (svg) {
        Array.from(el.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.remove();
        });
        el.appendChild(document.createTextNode(' ' + val));
      } else if (val.includes('<')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    // Translate placeholders if present
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update active button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Persist choice
    try { localStorage.setItem('figus-lang', lang); } catch (e) { /* ignore */ }
  }

  // Wire up buttons
  const langSwitcher = document.getElementById('langSwitcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', e => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      if (lang) applyLang(lang);
    });
  }

  // Restore saved language on load
  try {
    const saved = localStorage.getItem('figus-lang');
    if (saved && translations[saved]) applyLang(saved);
  } catch (e) { /* ignore */ }
});
