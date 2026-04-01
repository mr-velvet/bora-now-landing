// Animation presets + per-slide timeline builder
// Timelines are played/reversed on slide enter/leave

const PRESETS = {
  'fade-up': {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, ease: 'power3.out', duration: 0.7 },
  },
  'fade-left': {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0, ease: 'power3.out', duration: 0.7 },
  },
  'fade-right': {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0, ease: 'power3.out', duration: 0.7 },
  },
  'scale-in': {
    from: { opacity: 0, scale: 0.85 },
    to: { opacity: 1, scale: 1, ease: 'back.out(1.4)', duration: 0.8 },
  },
  'clip-reveal': {
    from: { clipPath: 'inset(15%)' },
    to: { clipPath: 'inset(0%)', ease: 'power4.inOut', duration: 1.0 },
  },
};

const STAGGER = {
  hero: 0.12,
  'section-divider': 0.12,
  'step-divider': 0.15,
  statement: 0.03,
  'metrics-grid': 0.1,
  'insights-list': 0.12,
  'insights-split': 0.12,
  'feature-mockup': 0.15,
  'chat-statement': 0.15,
  'two-cards': 0.15,
  'fullscreen-image': 0,
  'thank-you': 0.12,
  'cta-form': 0.3,
};

// Manual text splitting
function splitIntoWords(el) {
  const text = el.textContent;
  const words = text.split(/\s+/).filter(Boolean);
  el.innerHTML = words.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
  return el.querySelectorAll('.word-inner');
}

function splitIntoLines(el) {
  const lines = el.querySelectorAll('.line');
  if (lines.length > 0) {
    lines.forEach(line => {
      const wrapper = document.createElement('span');
      wrapper.className = 'line-mask';
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'block';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    return lines;
  }
  const content = el.innerHTML;
  el.innerHTML = `<span class="line-mask" style="overflow:hidden;display:block"><span class="line">${content}</span></span>`;
  return el.querySelectorAll('.line');
}

function animateSplitLines(tl, el, position) {
  const lines = splitIntoLines(el);
  const gsap = window.gsap;
  gsap.set(lines, { y: '110%', opacity: 0 });
  tl.to(lines, {
    y: '0%',
    opacity: 1,
    duration: 0.6,
    ease: 'power4.out',
    stagger: 0.08,
  }, position);
}

function animateSplitWords(tl, el, position) {
  const words = splitIntoWords(el);
  const gsap = window.gsap;
  gsap.set(words, { opacity: 0, y: 16 });
  tl.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: 'power3.out',
    stagger: 0.03,
  }, position);
}

function animateTypewriter(tl, el, position) {
  const gsap = window.gsap;

  // Parse original HTML into segments (text chunks + HTML tags)
  const origHTML = el.innerHTML.replace(/<span class="typing-cursor"><\/span>/g, '');
  const segments = [];
  const tagRegex = /(<[^>]+>)/g;
  let lastIdx = 0, m;
  while ((m = tagRegex.exec(origHTML)) !== null) {
    if (m.index > lastIdx) segments.push({ type: 'text', text: origHTML.slice(lastIdx, m.index) });
    segments.push({ type: 'tag', text: m[1] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < origHTML.length) segments.push({ type: 'text', text: origHTML.slice(lastIdx) });

  const totalChars = segments.reduce((s, seg) => s + (seg.type === 'text' ? seg.text.length : 0), 0);
  const typeDuration = Math.min(totalChars * 0.04, 2.8);

  // Setup: clear element, add typing container + cursor
  el.innerHTML = '';
  const typingSpan = document.createElement('span');
  typingSpan.className = 'typewriter-reveal';
  el.appendChild(typingSpan);
  const cursorEl = document.createElement('span');
  cursorEl.className = 'typing-cursor';
  el.appendChild(cursorEl);

  // Typing animation via proxy
  const proxy = { progress: 0 };
  tl.to(proxy, {
    progress: 1,
    duration: typeDuration,
    ease: 'none',
    onUpdate() {
      const target = Math.floor(proxy.progress * totalChars);
      let result = '', shown = 0, openTags = [];
      for (const seg of segments) {
        if (seg.type === 'tag') {
          result += seg.text;
          if (seg.text.startsWith('</')) openTags.pop();
          else if (!seg.text.endsWith('/>')) openTags.push(seg.text);
        } else {
          const rem = target - shown;
          if (rem <= 0) break;
          const slice = seg.text.slice(0, rem);
          result += slice;
          shown += slice.length;
          if (shown >= target) {
            for (let i = openTags.length - 1; i >= 0; i--) {
              const tn = openTags[i].match(/<(\w+)/)?.[1];
              if (tn) result += `</${tn}>`;
            }
            break;
          }
        }
      }
      typingSpan.innerHTML = result;
    },
  }, position);

  // After typing complete: cursor stops blinking then fades
  const afterTyping = position + typeDuration + 0.3;
  tl.to(cursorEl, { opacity: 0, duration: 0.4, ease: 'power2.out' }, afterTyping);

  // Emojis pop in sequentially
  tl.add(() => {
    const emojis = el.querySelectorAll('.statement-emoji');
    gsap.to(emojis, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)', stagger: 0.15 });
  }, afterTyping + 0.15);

  // Highlight backgrounds sweep in
  tl.add(() => {
    const bgs = el.querySelectorAll('.highlight-bg');
    gsap.to(bgs, { scaleX: 1, duration: 0.5, ease: 'power3.out', stagger: 0.12 });
  }, afterTyping + 0.5);
}

function animateCountUp(tl, el, position) {
  const target = parseFloat(el.dataset.countTo) || 0;
  const prefix = el.dataset.countPrefix || '';
  const suffix = el.dataset.countSuffix || '';
  const obj = { val: 0 };

  el.textContent = `${prefix}0${suffix}`;

  tl.to(obj, {
    val: target,
    duration: 1.0,
    ease: 'power2.inOut',
    onUpdate() {
      const display = target % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
      el.textContent = `${prefix}${display}${suffix}`;
    },
  }, position);
}

// Build a paused timeline for a section
export function buildTimeline(section, slideType) {
  const gsap = window.gsap;
  const staggerBase = STAGGER[slideType] || 0.12;

  const elements = Array.from(section.querySelectorAll('[data-anim]'));
  elements.sort((a, b) => (parseInt(a.dataset.animOrder) || 0) - (parseInt(b.dataset.animOrder) || 0));

  const tl = gsap.timeline({ paused: true });

  let time = 0;
  let prevChatEl = null;

  elements.forEach((el) => {
    const anim = el.dataset.anim;

    if (anim === 'split-lines') {
      animateSplitLines(tl, el, time);
    } else if (anim === 'split-words') {
      animateSplitWords(tl, el, time);
    } else if (anim === 'typewriter') {
      animateTypewriter(tl, el, time);
    } else if (anim === 'count-up') {
      animateCountUp(tl, el, time);
    } else if (anim === 'chat-typing') {
      // Typing indicator: appear, pulse, then hide
      gsap.set(el, { opacity: 0, y: 10 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, time);
      tl.to(el, { opacity: 0, display: 'none', duration: 0.2 }, time + 0.8);
      time += 1.0;
    } else if (anim === 'chat-bubble') {
      // Variable rhythm based on previous bubble
      const prevBubble = prevChatEl;
      let delay = 0.3; // default first msg
      if (prevBubble) {
        const prevFrom = prevBubble.classList.contains('user') ? 'user' : 'bot';
        const curFrom = el.classList.contains('user') ? 'user' : 'bot';
        if (prevFrom === 'user' && curFrom === 'bot') delay = 0.2; // typing indicator already added delay
        else if (prevFrom === 'bot' && curFrom === 'bot') delay = 0.4;
        else if (prevFrom === 'bot' && curFrom === 'user') delay = 0.6;
      }
      gsap.set(el, { opacity: 0, y: 20 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, time);
      time += delay;
      prevChatEl = el;
    } else if (PRESETS[anim]) {
      const preset = PRESETS[anim];
      gsap.set(el, preset.from);
      tl.to(el, { ...preset.to }, time);
    }

    time += staggerBase;
  });

  return tl;
}
