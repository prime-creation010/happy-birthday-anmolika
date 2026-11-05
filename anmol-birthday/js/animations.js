(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Lenis is optional: native scrolling remains available if its CDN fails.
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.utils.toArray('.reveal').forEach((element, index) => {
    if (element.closest('.hero')) return;
    gsap.fromTo(element,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: .85, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true } }
    );
  });

  gsap.utils.toArray('.photo-frame').forEach(frame => {
    const placeholder = frame.querySelector('.photo-placeholder');
    if (!placeholder) return;
    gsap.fromTo(placeholder, { clipPath: 'inset(8% 8% 8% 8%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: frame, start: 'top 85%', once: true }
    });
  });

  gsap.utils.toArray('.award-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to(card, { rotateY: x * 5, rotateX: -y * 5, duration: .35, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .5 }));
  });

  const enter = document.getElementById('enterButton');
  if (enter && lenis) enter.addEventListener('click', () => lenis.scrollTo('#birthday', { duration: 1.4 }));
})();
