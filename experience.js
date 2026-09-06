(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('#heroVideo');
  const motionButton = document.querySelector('#motionToggle');
  const galleryButton = document.querySelector('#galleryToggle');
  const story = document.querySelector('.image-story');
  const options = [...document.querySelectorAll('[data-story]')];
  const frames = [...document.querySelectorAll('[data-frame]')];
  const dialog = document.querySelector('#filmDialog');
  const film = document.querySelector('#fullVideo');
  let motion = !reduced.matches && !navigator.connection?.saveData;
  let galleryPlaying = false;
  let galleryVisible = false;
  let heroVisible = true;
  let active = 0;
  let timer;
  let imageRequest = 0;
  let previousFocus;

  function syncHero() {
    if (motion && heroVisible && !document.hidden && !dialog.open) {
      if (!hero.getAttribute('src')) hero.src = hero.dataset.src;
      hero.play().catch(() => { hero.classList.remove('ready'); });
    } else hero.pause();
  }
  function updateMotion() {
    document.body.classList.toggle('motion-enabled', motion);
    document.body.classList.toggle('motion-paused', !motion);
    motionButton.setAttribute('aria-pressed', String(motion));
    motionButton.setAttribute('aria-label', motion ? 'Pausar movimiento' : 'Activar movimiento');
    motionButton.replaceChildren(document.createTextNode(motion ? 'Ⅱ ' : '▶ '));
    const label = document.createElement('span');
    label.textContent = motion ? 'Pausar movimiento' : 'Activar movimiento';
    motionButton.append(label);
    syncHero();
    scheduleGallery();
  }
  hero.addEventListener('playing', () => hero.classList.add('ready'));
  hero.addEventListener('error', () => hero.classList.remove('ready'));
  motionButton.addEventListener('click', () => {
    motion = !motion;
    if (!motion) setGalleryPlaying(false);
    updateMotion();
  });

  function setGalleryPlaying(value) {
    galleryPlaying = value;
    galleryButton.setAttribute('aria-pressed', String(value));
    galleryButton.textContent = value ? 'Pausar imágenes' : 'Reproducir imágenes';
    // Automatic changes stay silent; deliberate selections are announced.
    document.querySelector('#imageCounter').setAttribute('aria-live', value ? 'off' : 'polite');
    scheduleGallery();
  }
  function scheduleGallery() {
    clearTimeout(timer);
    if (galleryPlaying && galleryVisible && !document.hidden && !dialog.open && !story.matches(':hover') && !story.contains(document.activeElement)) {
      timer = setTimeout(() => { showImage(active + 1); }, 5500);
    }
  }
  async function showImage(index) {
    const request = ++imageRequest;
    const next = (index + frames.length) % frames.length;
    const image = frames[next].querySelector('img');
    image.loading = 'eager';
    try { await image.decode(); } catch {
      if (request === imageRequest) {
        setGalleryPlaying(false);
        showToast('No se pudo cargar la imagen. Probá nuevamente.');
      }
      return;
    }
    if (request !== imageRequest) return;
    const previous = active;
    active = next;
    frames.forEach((frame, i) => {
      frame.classList.toggle('previous', i === previous && i !== active);
      frame.classList.toggle('active', i === active);
      frame.setAttribute('aria-hidden', String(i !== active));
    });
    options.forEach((option, i) => {
      option.classList.toggle('active', i === active);
      option.setAttribute('aria-pressed', String(i === active));
    });
    document.querySelector('#imageCounter').textContent = `${String(active + 1).padStart(2, '0')} / 03`;
    scheduleGallery();
  }
  function selectImage(index) { setGalleryPlaying(false); showImage(index); }
  options.forEach((button, index) => button.addEventListener('click', () => selectImage(index)));
  document.querySelector('#previousImage').addEventListener('click', () => selectImage(active - 1));
  document.querySelector('#nextImage').addEventListener('click', () => selectImage(active + 1));
  galleryButton.addEventListener('click', () => setGalleryPlaying(!galleryPlaying));
  story.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    selectImage(active + (event.key === 'ArrowRight' ? 1 : -1));
  });
  story.addEventListener('pointerenter', () => clearTimeout(timer));
  story.addEventListener('pointerleave', scheduleGallery);
  story.addEventListener('focusin', () => clearTimeout(timer));
  story.addEventListener('focusout', () => requestAnimationFrame(scheduleGallery));
  let touchStart;
  story.addEventListener('touchstart', event => { touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  story.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) selectImage(active + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  document.querySelectorAll('[data-open-film]').forEach(button => button.addEventListener('click', () => {
    previousFocus = button;
    dialog.showModal();
    document.body.classList.add('film-open');
    hero.pause();
    clearTimeout(timer);
    if (!film.getAttribute('src')) film.src = hero.dataset.src;
    film.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    document.querySelector('#closeFilm').focus();
  }));
  document.querySelector('#closeFilm').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    film.pause();
    document.body.classList.remove('film-open');
    previousFocus?.focus();
    syncHero();
    scheduleGallery();
  });
  film.addEventListener('error', () => { document.querySelector('#filmError').hidden = false; });
  film.addEventListener('loadeddata', () => { document.querySelector('#filmError').hidden = true; });

  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target.id === 'inicio') heroVisible = entry.isIntersecting;
        else {
          galleryVisible = entry.isIntersecting;
          if (galleryVisible) frames.forEach(frame => { frame.querySelector('img').loading = 'eager'; });
        }
      });
      syncHero();
      scheduleGallery();
    }, { threshold: .15 });
    mediaObserver.observe(document.querySelector('#inicio'));
    mediaObserver.observe(story);
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('waiting'); reveals.unobserve(entry.target); }
    }), { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(section => { section.classList.add('waiting'); reveals.observe(section); });
  } else galleryVisible = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) film.pause();
    syncHero(); scheduleGallery();
  });
  reduced.addEventListener('change', () => {
    motion = !reduced.matches && !navigator.connection?.saveData;
    if (reduced.matches) setGalleryPlaying(false);
    updateMotion();
  });
  setGalleryPlaying(motion);
  updateMotion();
})();
