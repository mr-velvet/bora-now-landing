// FitText — auto-scale font-size to fill container width
// Elements with data-fit-text are processed automatically
// Options via attribute: data-fit-text="max:200,factor:0.9"

function parseOpts(el) {
  const raw = el.getAttribute('data-fit-text') || '';
  const opts = { min: 16, max: 300, factor: 0.9 };
  raw.split(',').forEach(pair => {
    const [k, v] = pair.split(':').map(s => s.trim());
    if (k && v) opts[k] = parseFloat(v);
  });
  return opts;
}

export function fitElement(el, opts = {}) {
  const o = { min: 16, max: 300, factor: 0.9, ...opts };
  const lines = el.querySelectorAll('.line');

  // Hide cursor and emojis during measurement so they don't affect sizing
  const cursor = el.querySelector('.typing-cursor');
  const emojis = el.querySelectorAll('.statement-emoji');
  if (cursor) cursor.style.display = 'none';
  emojis.forEach(e => e.style.display = 'none');

  if (lines.length > 0) {
    lines.forEach(line => fitSingle(line, o));
  } else {
    fitSingle(el, o);
  }

  if (cursor) cursor.style.display = '';
  emojis.forEach(e => e.style.display = '');
}

function fitSingle(el, o) {
  const isStatement = el.classList.contains('statement-text') || el.classList.contains('cs-title');

  if (isStatement) {
    // For statements/cs-title we want text to fill a wide rectangular area.
    // Use the slide-frame as reference since it's the visible card.
    const frame = el.closest('.slide-frame');
    if (!frame) return;
    const frameW = frame.clientWidth;
    const frameH = frame.clientHeight;

    const isCsTitle = el.classList.contains('cs-title');
    // Available area based on layout type
    const padH = frameW * 0.06 * 2;
    const padV = isCsTitle ? frameH * 0.08 * 2 : frameH * 0.14 * 2;
    const availW = isCsTitle ? (frameW - padH) * 0.65 : frameW - padH;
    const availH = isCsTitle ? frameH * 0.45 : frameH - padV;

    // The element has width:100% via CSS, so scrollWidth won't exceed container.
    // We need to temporarily remove that so we can measure natural text width too.
    const origWidth = el.style.width;
    el.style.width = availW + 'px';

    // Binary search: find largest font-size where text fits in the box
    let lo = o.min;
    let hi = Math.min(o.max, 200);

    for (let i = 0; i < 25; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';

      const sh = el.scrollHeight;
      if (sh > availH) {
        hi = mid;
      } else {
        lo = mid;
      }
    }

    el.style.fontSize = Math.floor(lo) + 'px';
    el.style.width = origWidth;

    // Debug — remove after confirming
    console.log('[fit-text statement]', {
      frameW, frameH, availW, availH,
      finalSize: Math.floor(lo),
      scrollH: el.scrollHeight,
      text: el.textContent.slice(0, 40)
    });
    return;
  }

  // Default: single-line fit to container width (hero titles, step titles, etc.)
  const container = el.closest('.slide-frame') || el.parentElement;
  if (!container) return;
  const containerW = container.clientWidth;
  const current = parseFloat(getComputedStyle(el).fontSize) || 32;

  el.style.fontSize = current + 'px';
  el.style.whiteSpace = 'nowrap';
  const scrollW = el.scrollWidth;
  el.style.whiteSpace = '';

  if (scrollW <= 0) return;
  const newSize = Math.min(o.max, Math.max(o.min, current * (containerW * o.factor) / scrollW));
  el.style.fontSize = newSize + 'px';
}

export function fitAll(root = document) {
  root.querySelectorAll('[data-fit-text]').forEach(el => {
    fitElement(el, parseOpts(el));
  });
}
