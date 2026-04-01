// Progress indicator — vertical dots on the right side

import { scrollTo, onChange } from './scroll.js';
import { themes } from './themes.js';

let nav = null;
let dots = [];
let sections = [];

export function initProgress(sectionElements) {
  sections = sectionElements;

  nav = document.createElement('nav');
  nav.className = 'progress-nav';
  nav.setAttribute('aria-label', 'Section navigation');

  sections.forEach((section, i) => {
    const dot = document.createElement('button');
    dot.className = 'progress-dot';
    dot.setAttribute('aria-label', `Go to section ${i + 1}`);
    dot.addEventListener('click', () => scrollTo(i));
    nav.appendChild(dot);
    dots.push(dot);
  });

  document.body.appendChild(nav);

  // Listen for slide changes
  onChange((index) => setActive(index));

  // Set first dot active
  setActive(0);
}

function setActive(index) {
  dots.forEach((d, i) => d.classList.toggle('active', i === index));

  const section = sections[index];
  if (!section) return;

  const themeName = section.dataset.theme || 'light';
  const themeVars = themes[themeName] || themes.light;
  nav.style.setProperty('--dot-color', themeVars['--dot-color']);
  nav.style.setProperty('--dot-active', themeVars['--dot-active']);
}
