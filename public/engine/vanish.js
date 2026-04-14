// Vanish effects — reusable animation functions
// All elements must have structure: .vanish-mask(overflow:hidden) > .vanish-inner
// Each function adds tweens to an existing GSAP timeline at a given start time.

const gsap = () => window.gsap;

// Sink down into invisible floor (mask rises while inner drops)
export function vanishDown(tl, els, start = 0, opts = {}) {
  const { duration = 0.35, stagger = 0.04, ease = 'power2.in' } = opts;
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach((el, i) => {
    const inner = el.querySelector('.vanish-inner') || el;
    const mask = inner.parentElement;
    const t = start + i * stagger;
    tl.to(inner, { y: '110%', duration, ease }, t);
    tl.to(mask, { y: -10, duration, ease }, t);
  });
}

// Rise up from below (reverse of vanishDown)
export function revealUp(tl, els, start = 0, opts = {}) {
  const { duration = 0.4, stagger = 0.04, ease = 'power3.out' } = opts;
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach((el, i) => {
    const inner = el.querySelector('.vanish-inner') || el;
    const mask = inner.parentElement;
    const t = start + i * stagger;
    tl.to(mask, { y: 0, duration, ease }, t);
    tl.to(inner, { y: '0%', duration, ease }, t);
  });
}

// Slide out to the right, clipped by mask
export function vanishRight(tl, els, start = 0, opts = {}) {
  const { duration = 0.35, stagger = 0.04, ease = 'power2.in' } = opts;
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach((el, i) => {
    const inner = el.querySelector('.vanish-inner') || el;
    const t = start + i * stagger;
    tl.to(inner, { x: '110%', duration, ease }, t);
  });
}

// Slide in from the right (reverse of vanishRight)
export function revealLeft(tl, els, start = 0, opts = {}) {
  const { duration = 0.4, stagger = 0.04, ease = 'power3.out' } = opts;
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach((el, i) => {
    const inner = el.querySelector('.vanish-inner') || el;
    const t = start + i * stagger;
    tl.to(inner, { x: '0%', duration, ease }, t);
  });
}

// Set elements to their hidden state (for initialization)
export function setHidden(els, direction = 'down') {
  const g = gsap();
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach(el => {
    const inner = el.querySelector('.vanish-inner') || el;
    if (direction === 'down') {
      g.set(inner, { y: '110%' });
    } else if (direction === 'right') {
      g.set(inner, { x: '110%' });
    }
  });
}

// Set elements to their visible state
export function setVisible(els) {
  const g = gsap();
  const items = Array.from(typeof els === 'string' ? document.querySelectorAll(els) : els.length !== undefined ? els : [els]);
  items.forEach(el => {
    const inner = el.querySelector('.vanish-inner') || el;
    g.set(inner, { y: '0%', x: '0%' });
    g.set(inner.parentElement, { y: 0 });
  });
}
