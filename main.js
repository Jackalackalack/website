/* ============================================================
   Jack Abraham — new-site/main.js
   ============================================================ */

// --- Burger menu -------------------------------------------
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});


// --- Scroll-triggered fade-in ------------------------------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// --- Active nav link on scroll -----------------------------
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('#nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`#nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// --- Read-more toggle (mobile only) ------------------------
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body     = btn.previousElementSibling; // .text-body
    const expanded = body.classList.toggle('expanded');
    btn.textContent = expanded ? 'Read less' : 'Read more';
    btn.setAttribute('aria-expanded', String(expanded));
  });
});


// --- Carousel dots (shared logic) --------------------------
function initCarousel(strip, itemSelector) {
  const dotsContainer = strip.nextElementSibling;
  if (!dotsContainer || !dotsContainer.classList.contains('carousel-dots')) return;

  const items = Array.from(strip.querySelectorAll(itemSelector));

  items.forEach((item, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to item ${i + 1}`);
    dot.addEventListener('click', () => {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

  const itemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = items.indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { root: strip, threshold: 0.6 });

  items.forEach(t => itemObserver.observe(t));
}

document.querySelectorAll('.image-collection').forEach(strip => initCarousel(strip, '.img-tile'));
document.querySelectorAll('.logo-grid--large').forEach(strip => initCarousel(strip, 'a'));


// --- Mobile: tap once to reveal overlay, tap again to navigate ---
if ('ontouchstart' in window) {
  document.querySelectorAll('a.img-tile').forEach(tile => {
    let startX, startY;

    tile.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    tile.addEventListener('touchend', e => {
      const dx = Math.abs(e.changedTouches[0].clientX - startX);
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      if (dx > 10 || dy > 10) return; // was a scroll, not a tap

      if (!tile.classList.contains('tapped')) {
        e.preventDefault();
        document.querySelectorAll('a.img-tile.tapped').forEach(t => t.classList.remove('tapped'));
        tile.classList.add('tapped');
      }
      // second tap: let browser navigate normally
    });
  });

  document.addEventListener('touchstart', e => {
    if (!e.target.closest('a.img-tile')) {
      document.querySelectorAll('a.img-tile.tapped').forEach(t => t.classList.remove('tapped'));
    }
  }, { passive: true });
}


// --- Video: play when visible, pause when not --------------
document.querySelectorAll('.img-tile video').forEach(video => {
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });

  videoObserver.observe(video);
});
