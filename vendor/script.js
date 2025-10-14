//Меню бургер

 const iconMenu = document.querySelector ('.menu__icon');
 if (iconMenu) {
  const menuBody = document.querySelector('.header__info');
  iconMenu.addEventListener("click",function(e) {
    document.body.classList.toggle('_lock');
    iconMenu.classList.toggle('_active');
    menuBody.classList.toggle('_active');
  }); }


  
  const showTab = (elTabBtn) => {
    const elTab = elTabBtn.closest('.tab');
    if (elTabBtn.classList.contains('tab-btn-active')) {
      return;
    }
    const targetId = elTabBtn.dataset.targetId;
    const elTabPane = elTab.querySelector(`.tab-pane[data-id="${targetId}"]`);
    if (elTabPane) {
      const elTabBtnActive = elTab.querySelector('.tab-btn-active');
      elTabBtnActive.classList.remove('tab-btn-active');
      const elTabPaneShow = elTab.querySelector('.tab-pane-show');
      elTabPaneShow.classList.remove('tab-pane-show');
      elTabBtn.classList.add('tab-btn-active');
      elTabPane.classList.add('tab-pane-show');
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target && !e.target.closest('.tab-btn')) {
      return;
    }
    const elTabBtn = e.target.closest('.tab-btn');
    showTab(elTabBtn);
  });


  // Generic carousel initializer for multiple blocks
  function initCarousel(root, prefix) {
    const viewport = root.querySelector(`.${prefix}__viewport`);
    const track = root.querySelector(`.${prefix}__track`);
    const slides = Array.from(root.querySelectorAll(`.${prefix}__slide`));
    const btnPrev = root.querySelector(`.${prefix}__nav_prev`);
    const btnNext = root.querySelector(`.${prefix}__nav_next`);
    if (!viewport || !track || slides.length === 0) return;

    let index = 0;
    let width = viewport.clientWidth;

    const clampIndex = (i) => {
      if (i < 0) return slides.length - 1;
      if (i >= slides.length) return 0;
      return i;
    };

    const update = () => {
      width = viewport.clientWidth;
      track.style.transform = `translateX(${-index * width}px)`;
    };

    const goTo = (i) => { index = clampIndex(i); update(); };
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    btnNext && btnNext.addEventListener('click', next);
    btnPrev && btnPrev.addEventListener('click', prev);
    window.addEventListener('resize', update);

    // Keyboard navigation (focusable region)
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); }
      if (e.key === 'ArrowLeft') { prev(); }
    });

    // Basic swipe support
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let baseOffset = 0;

    const onPointerDown = (e) => {
      dragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      baseOffset = -index * viewport.clientWidth;
      track.style.transition = 'none';
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const dx = currentX - startX;
      track.style.transform = `translateX(${baseOffset + dx}px)`;
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      const dx = (currentX || startX) - startX;
      const threshold = Math.max(40, viewport.clientWidth * 0.1);
      if (dx > threshold) {
        prev();
      } else if (dx < -threshold) {
        next();
      } else {
        update();
      }
      startX = 0; currentX = 0;
    };

    // Mouse events (scoped to viewport)
    viewport.addEventListener('mousedown', onPointerDown);
    viewport.addEventListener('mousemove', onPointerMove);
    viewport.addEventListener('mouseup', onPointerUp);
    viewport.addEventListener('mouseleave', onPointerUp);
    // Touch events (prevent vertical scroll when swiping horizontally)
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchmove', (e) => {
      onPointerMove(e);
      if (dragging) e.preventDefault();
    }, { passive: false });
    viewport.addEventListener('touchend', onPointerUp);

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.transition = 'none';
    }

    // Init position
    update();
  }

  // Initialize carousels
  (function(){
    const reviews = document.querySelector('.reviews');
    if (reviews) initCarousel(reviews, 'reviews');
    const docs = document.querySelector('.docs');
    if (docs) initCarousel(docs, 'docs');
  })();

  // Lightbox for docs images
  (function initDocsLightbox(){
    const imgs = document.querySelectorAll('.docs .docs__slide img');
    if (!imgs.length) return;

    // Create overlay once
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','Просмотр документа');
    overlay.innerHTML = '<button class="lightbox__close" aria-label="Закрыть">×</button><img class="lightbox__img" alt="Документ" />';
    const overlayImg = overlay.querySelector('.lightbox__img');
    const closeBtn = overlay.querySelector('.lightbox__close');
    document.body.appendChild(overlay);

    const open = (src, alt) => {
      overlayImg.src = src;
      overlayImg.alt = alt || 'Документ';
      overlay.classList.add('is-open');
      document.body.classList.add('_lock');
    };
    const close = () => {
      overlay.classList.remove('is-open');
      document.body.classList.remove('_lock');
      overlayImg.src = '';
    };

    imgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src, img.alt));
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  })();

  
