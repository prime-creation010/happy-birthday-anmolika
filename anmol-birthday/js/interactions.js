(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);

  // Music never starts without an explicit user action. Missing audio fails quietly.
  const music = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');
  if (music && musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (music.paused) {
        try {
          await music.play();
          musicToggle.setAttribute('aria-pressed', 'true');
          musicToggle.setAttribute('aria-label', 'Pause background music');
          $('.music-text', musicToggle).textContent = 'SOUND ON';
        } catch (_) {
          $('.music-text', musicToggle).textContent = 'AUDIO UNAVAILABLE';
          musicToggle.setAttribute('aria-label', 'Background music unavailable');
        }
      } else {
        music.pause();
        musicToggle.setAttribute('aria-pressed', 'false');
        musicToggle.setAttribute('aria-label', 'Play background music');
        $('.music-text', musicToggle).textContent = 'SOUND OFF';
      }
    });
    music.addEventListener('error', () => {
      if (musicToggle.getAttribute('aria-pressed') === 'true') {
        musicToggle.setAttribute('aria-pressed', 'false');
        $('.music-text', musicToggle).textContent = 'AUDIO UNAVAILABLE';
      }
    });
  }

  // Chapter 01 entrance button.
  const enter = $('#enterButton');
  if (enter) enter.addEventListener('click', () => {
    document.querySelector('#birthday')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  // Award cards are keyboard-accessible buttons with expandable details.
  document.querySelectorAll('.award-card').forEach(card => {
    card.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!expanded));
      const hint = $('.award-hint', card);
      if (hint) hint.textContent = expanded ? 'TAP TO REVEAL' : 'HONOUR OFFICIALLY GRANTED';
    });
  });

  // Hidden P.S. message.
  const surpriseButton = $('#surpriseTrigger');
  const surpriseMessage = $('#surpriseMessage');
  if (surpriseButton && surpriseMessage) {
    surpriseButton.addEventListener('click', () => {
      const opening = surpriseMessage.hidden;
      surpriseMessage.hidden = !opening;
      surpriseButton.setAttribute('aria-expanded', String(opening));
      $('span', surpriseButton).textContent = opening ? '−' : '＋';
    });
  }

  // Asia/Kolkata calendar countdown. Uses a fixed UTC+05:30 target instant.
  function updateCountdown() {
    const target = Date.UTC(2026, 10, 15, 0, 0, 0) - (5.5 * 60 * 60 * 1000);
    const now = Date.now();
    const card = $('#countdownCard');
    if (!card) return;
    if (now >= target) {
      $('#countdownKicker').textContent = 'IT IS YOUR DAY';
      $('#countdownValues').innerHTML = '<p class="birthday-live-message">Today deserves to be celebrated. Happy Birthday, Anmolika!</p>';
      return;
    }
    const remaining = target - now;
    const units = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(units).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value).padStart(2, '0');
    });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Desktop-only, low-contrast cursor glow.
  const glow = $('.cursor-glow');
  if (glow && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', event => {
      glow.style.opacity = '.9';
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }

  // Floating gold dust on the opening screen; capped for performance.
  const canvas = $('#particleCanvas');
  if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0, height = 0, raf = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(65, Math.floor(width / 17));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.4 + .35, v: Math.random() * .22 + .06,
        a: Math.random() * .45 + .12, phase: Math.random() * 6.28
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.v; p.phase += .012;
        if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
        ctx.beginPath(); ctx.arc(p.x + Math.sin(p.phase) * 5, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214,183,121,${p.a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
    });
  }
})();
