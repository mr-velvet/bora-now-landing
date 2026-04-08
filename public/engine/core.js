// SlidesEngine — main orchestrator

import { applyTheme } from './themes.js';
import { renderSlide } from './templates.js';
import { buildTimeline } from './animations.js';
import { initScroll, onChange, onBeforeChange } from './scroll.js';
import { themes } from './themes.js';
import { fitAll } from './fit-text.js';

export class SlidesEngine {
  constructor(config) {
    this.config = config;
    this.sections = [];
    this.timelines = [];
  }

  init() {
    document.title = this.config.meta.title || 'Slides';

    const main = document.querySelector('main');
    if (!main) throw new Error('Missing <main> element');

    // Render slides
    this.config.slides.forEach((slide) => {
      const section = document.createElement('section');
      section.id = slide.id;
      section.className = `slide slide--${slide.type}`;

      const theme = slide.theme || this.config.defaults.theme || 'light';
      applyTheme(section, theme);

      // Wrap content in slide-frame for the bordered card effect
      const frame = document.createElement('div');
      frame.className = 'slide-frame';
      frame.innerHTML = renderSlide(slide);
      section.appendChild(frame);

      main.appendChild(section);
      this.sections.push(section);
    });

    // FitText MUST run before buildTimeline — typewriter animation
    // clears innerHTML, so we need text present for measurement
    fitAll(main);

    // Build animation timelines (all paused)
    this.config.slides.forEach((slide, i) => {
      const tl = buildTimeline(this.sections[i], slide.type);
      this.timelines.push(tl);
    });

    // Init slide-based scroll (wheel/touch/key)
    initScroll(this.sections);

    // Slide counter
    const total = this.sections.length;
    const counter = document.createElement('div');
    counter.className = 'slide-counter';
    counter.textContent = `1 / ${total}`;
    document.body.appendChild(counter);

    // Play first slide animation
    if (this.timelines[0]) {
      this.timelines[0].play();
    }

    // On slide change
    let previousIndex = 0;
    onChange((index) => {
      // Reverse previous
      if (this.timelines[previousIndex]) {
        this.timelines[previousIndex].reverse();
      }
      // Play new (delayed slightly so transition is visible first)
      if (this.timelines[index]) {
        setTimeout(() => this.timelines[index].restart(), 250);
      }
      // Update counter
      counter.textContent = `${index + 1} / ${total}`;
      // Update counter color based on theme
      const themeName = this.sections[index].dataset.theme || 'light';
      const themeVars = themes[themeName] || themes.light;
      counter.style.color = themeVars['--dot-color'];

      previousIndex = index;
    });

    // Recalculate on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => fitAll(main), 150);
    });
  }

  onChange(cb) {
    onChange(cb);
  }

  onBeforeChange(cb) {
    onBeforeChange(cb);
  }
}
