// Slide-based navigation — NO native scroll
// One wheel/touch/key event = one slide transition

let current = 0;
let total = 0;
let sections = [];
let isAnimating = false;
let onChangeCallbacks = [];

const TRANSITION_DURATION = 0.9;
const COOLDOWN = 900; // ms before next transition allowed

export function initScroll(sectionElements) {
  sections = sectionElements;
  total = sections.length;

  // Position all slides: first visible, rest below
  const gsap = window.gsap;
  sections.forEach((s, i) => {
    gsap.set(s, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: i === 0 ? 2 : 1,
      opacity: i === 0 ? 1 : 0,
      visibility: i === 0 ? 'visible' : 'hidden',
    });
  });

  // Wheel
  window.addEventListener('wheel', handleWheel, { passive: false });

  // Touch
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  });
}

function handleWheel(e) {
  e.preventDefault();
  if (Math.abs(e.deltaY) < 10) return; // ignore tiny scroll
  e.deltaY > 0 ? goNext() : goPrev();
}

function goNext() {
  if (current < total - 1) goTo(current + 1);
}

function goPrev() {
  if (current > 0) goTo(current - 1);
}

export function goTo(index) {
  if (isAnimating || index === current || index < 0 || index >= total) return;
  isAnimating = true;

  const gsap = window.gsap;
  const from = sections[current];
  const to = sections[index];
  const direction = index > current ? 1 : -1;

  // Prepare incoming slide
  gsap.set(to, {
    visibility: 'visible',
    opacity: 1,
    zIndex: 2,
    y: direction * 100 + '%',
  });
  gsap.set(from, { zIndex: 1 });

  // Animate: incoming slides in, outgoing stays
  gsap.to(to, {
    y: '0%',
    duration: TRANSITION_DURATION,
    ease: 'power3.inOut',
    onComplete() {
      // Hide old slide
      gsap.set(from, { visibility: 'hidden', opacity: 0, zIndex: 1 });
      current = index;
      isAnimating = false;
      onChangeCallbacks.forEach(cb => cb(current));
    },
  });

  // Slight parallax on outgoing
  gsap.to(from, {
    y: direction * -30 + '%',
    duration: TRANSITION_DURATION,
    ease: 'power3.inOut',
  });
}

export function scrollTo(target) {
  if (typeof target === 'number') {
    goTo(target);
  } else if (target instanceof HTMLElement) {
    const idx = sections.indexOf(target);
    if (idx >= 0) goTo(idx);
  }
}

export function getCurrent() {
  return current;
}

export function onChange(cb) {
  onChangeCallbacks.push(cb);
}
