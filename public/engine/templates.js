// HTML generators for each slide type
// Every animatable element gets data-anim="preset" and data-anim-order="N"

export const templates = {
  hero(slide) {
    const c = slide.content;
    const titleLines = c.title.split('\n').map(l => {
      const weight = l.startsWith('*') ? 700 : 400;
      const text = l.replace(/^\*/, '');
      return `<span class="line" style="font-weight:${weight}">${text}</span>`;
    }).join('');
    return `
      <div class="slide-inner hero-inner">
        <div class="hero-topbar" data-anim="fade-up" data-anim-order="0">
          <span class="topbar-left">${c.eyebrow || ''}</span>
          <span class="topbar-center">${c.tagline || ''}</span>
          <span class="topbar-right">${c.brand || ''}</span>
        </div>
        <h1 class="hero-title" data-anim="split-lines" data-anim-order="1" data-fit-text>${titleLines}</h1>
        ${c.description ? `<p class="hero-desc" data-anim="fade-up" data-anim-order="2">${c.description}</p>` : ''}
        ${c.cta ? `<a href="${c.cta.url}" class="cta-btn" data-anim="fade-up" data-anim-order="3">${c.cta.label}</a>` : ''}
      </div>`;
  },

  statement(slide) {
    const c = slide.content;
    // Build text with emoji markers for specific words
    const emojiMap = c.emojis || {};
    const words = c.text.split(/\s+/);
    const wordSpans = words.map(w => {
      const clean = w.replace(/[.,!?;:]/g, '');
      const punct = w.slice(clean.length);
      const emoji = emojiMap[clean.toLowerCase()];
      if (emoji) {
        return `<span class="word-highlight" data-highlight-word><span class="highlight-bg"></span>${clean}<span class="statement-emoji">${emoji}</span></span>${punct}`;
      }
      return w;
    }).join(' ');

    return `
      <div class="slide-inner statement-inner">
        <p class="statement-text" data-anim="typewriter" data-anim-order="0" data-fit-text="max:500,factor:0.92">${wordSpans}<span class="typing-cursor"></span></p>
      </div>`;
  },

  'insights-split'(slide) {
    const c = slide.content;
    const itemsHtml = c.items.map((item, i) => `
      <div class="split-insight-item" data-anim="fade-up" data-anim-order="${i + 1}">
        <span class="insight-dot"></span>
        <div class="insight-content">
          <h3 class="insight-heading">${item.heading}</h3>
          <p class="insight-text">${item.text}</p>
        </div>
      </div>`).join('');
    return `
      <div class="slide-inner split-inner">
        <div class="split-left" data-anim="fade-right" data-anim-order="0">
          <h2 class="split-title" data-fit-text="factor:0.85">${c.title}</h2>
        </div>
        <div class="split-right">
          ${itemsHtml}
        </div>
      </div>`;
  },

  'section-divider'(slide) {
    const c = slide.content;
    return `
      <div class="slide-inner divider-inner">
        <span class="divider-number" data-anim="scale-in" data-anim-order="0">${c.number}</span>
        <h2 class="divider-title" data-anim="split-words" data-anim-order="1">${c.title}</h2>
        ${c.subtitle ? `<p class="divider-subtitle" data-anim="fade-up" data-anim-order="2">${c.subtitle}</p>` : ''}
      </div>`;
  },

  'step-divider'(slide) {
    const c = slide.content;
    return `
      <div class="slide-inner step-inner">
        <h2 class="step-title" data-anim="split-lines" data-anim-order="0" data-fit-text="factor:0.45">${c.title.split('\n').map(l => `<span class="line">${l}</span>`).join('')}</h2>
        <span class="step-number" data-anim="scale-in" data-anim-order="1">${c.number}</span>
      </div>`;
  },

  'chat-statement'(slide) {
    const c = slide.content;
    const chatBubbles = c.chat.map((msg, i) => {
      const prev = i > 0 ? c.chat[i - 1] : null;
      const needsTyping = msg.from === 'bot' && prev && prev.from === 'user';
      const typingHtml = needsTyping ? `<div class="cs-typing" data-anim="chat-typing" data-anim-order="${i + 2}"><span></span><span></span><span></span></div>` : '';
      return `${typingHtml}<div class="cs-bubble ${msg.from}" data-anim="chat-bubble" data-anim-order="${i + 2}">${msg.text.replace(/\n/g, '<br>')}</div>`;
    }).join('');

    // Telegram SVG icon
    const telegramIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>`;
    // WhatsApp SVG icon
    const whatsappIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.27-1.64A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm5.95 16.46c-.25.7-1.47 1.34-2.03 1.42-.52.08-1.18.11-1.9-.12a17.8 17.8 0 01-1.72-.64c-3.02-1.3-5-4.36-5.15-4.56-.16-.2-1.26-1.68-1.26-3.2 0-1.52.8-2.27 1.08-2.58.28-.3.62-.38.82-.38h.6c.19 0 .44-.07.7.53.25.6.88 2.14.96 2.3.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.46.54-.15.15-.3.3-.13.6.18.3.78 1.28 1.67 2.08 1.15.97 2.12 1.27 2.42 1.42.3.15.47.12.65-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.67-.15.28.1 1.75.82 2.05.97.3.15.5.23.57.35.08.12.08.7-.17 1.4z"/></svg>`;

    return `
      <div class="slide-inner cs-inner">
        <div class="cs-text-area">
          <p class="cs-title" data-anim="typewriter" data-anim-order="0" data-fit-text="max:500,factor:0.92">${c.text}<span class="typing-cursor"></span></p>
          <p class="cs-subtitle" data-anim="fade-up" data-anim-order="1"><span class="cs-icon">${telegramIcon}</span> <span class="cs-icon cs-icon-muted">${whatsappIcon}</span> ${c.subtitle}</p>
        </div>
        <div class="cs-chat-area">
          ${chatBubbles}
        </div>
      </div>`;
  },

  'two-cards'(slide) {
    const c = slide.content;
    // Chat bubbles for right card — with typing indicators before bot replies after user
    const chatHtml = c.chat ? `
      <div class="chat-mockup">
        <div class="chat-header">
          <div class="chat-avatar">C</div>
          <div>
            <div class="chat-name">Agente Confia.vc</div>
            <div class="chat-status">online</div>
          </div>
        </div>
        <div class="chat-messages">
          ${c.chat.map((msg, i) => {
            const prev = i > 0 ? c.chat[i - 1] : null;
            const needsTyping = msg.from === 'bot' && prev && prev.from === 'user';
            const typingHtml = needsTyping ? `<div class="chat-typing" data-anim="chat-typing" data-anim-order="${i + 2}"><span></span><span></span><span></span></div>` : '';
            return `${typingHtml}<div class="chat-bubble ${msg.from}" data-anim="chat-bubble" data-anim-order="${i + 2}">${msg.text.replace(/\n/g, '<br>')}</div>`;
          }).join('')}
        </div>
      </div>` : `<p class="card-text">${c.right || ''}</p>`;

    return `
      <div class="slide-inner twocards-inner">
        <div class="card card-left" data-anim="fade-left" data-anim-order="0">
          <p class="card-text" data-fit-text="factor:0.85">${c.left}</p>
        </div>
        <div class="card card-right" data-anim="fade-left" data-anim-order="1">
          ${chatHtml}
          ${c.icons ? `<div class="card-icons" data-anim="fade-up" data-anim-order="${c.chat ? c.chat.length + 2 : 2}">
            ${c.icons.map(icon => `<span class="card-icon">${icon}</span>`).join('')}
          </div>` : ''}
        </div>
      </div>`;
  },

  'cta-form'(slide) {
    const c = slide.content;
    const titleLines = c.title.split('\n').map(l => {
      const weight = l.startsWith('*') ? 700 : 400;
      const text = l.replace(/^\*/, '');
      return `<span class="line" style="font-weight:${weight}">${text}</span>`;
    }).join('');
    return `
      <div class="slide-inner cta-inner">
        <h2 class="cta-title" data-anim="split-lines" data-anim-order="0" data-fit-text>${titleLines}</h2>
        <p class="cta-brand" data-anim="fade-up" data-anim-order="1" data-fit-text="factor:0.45">${c.brand || ''}</p>
        <form class="cta-email-form" data-anim="fade-up" data-anim-order="2" onsubmit="return false;">
          <input type="email" placeholder="${c.placeholder || 'seu@email.com'}" class="cta-input" required>
          <button type="submit" class="cta-submit">${c.buttonLabel || 'Entrar'}</button>
        </form>
      </div>`;
  },

  'insights-list'(slide) {
    const c = slide.content;
    const itemsHtml = c.items.map((item, i) => `
      <div class="insight-item" data-anim="fade-up" data-anim-order="${i + 1}">
        <span class="insight-dot"></span>
        <div class="insight-content">
          <h3 class="insight-heading">${item.heading}</h3>
          <p class="insight-text">${item.text}</p>
        </div>
      </div>`).join('');
    return `
      <div class="slide-inner insights-inner">
        <h2 class="section-title" data-anim="fade-up" data-anim-order="0">${c.title}</h2>
        <div class="insights-list">${itemsHtml}</div>
      </div>`;
  },

  'metrics-grid'(slide) {
    const c = slide.content;
    const metricsHtml = c.metrics.map((m, i) => `
      <div class="metric-item" data-anim="fade-up" data-anim-order="${i + 1}">
        <span class="metric-value" data-anim="count-up" data-anim-order="${i + 1}" data-count-to="${m.value}" data-count-prefix="${m.prefix || ''}" data-count-suffix="${m.suffix || ''}">${m.prefix || ''}0${m.suffix || ''}</span>
        <span class="metric-label">${m.label}</span>
      </div>`).join('');
    return `
      <div class="slide-inner metrics-inner">
        <h2 class="section-title" data-anim="fade-up" data-anim-order="0">${c.title}</h2>
        <div class="metrics-grid">${metricsHtml}</div>
      </div>`;
  },

  'feature-mockup'(slide) {
    const c = slide.content;
    const isPhone = c.device === 'phone';
    const deviceClass = isPhone ? 'device-phone' : 'device-laptop';
    const screenGradient = `
      <svg class="mockup-screen" viewBox="0 0 ${isPhone ? '375 812' : '1280 800'}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="screen-grad-${slide.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="50%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#d946ef"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="8" fill="url(#screen-grad-${slide.id})"/>
      </svg>`;
    return `
      <div class="slide-inner mockup-inner">
        <div class="mockup-text">
          <h2 class="section-title" data-anim="fade-up" data-anim-order="0">${c.title}</h2>
          <p class="mockup-desc" data-anim="fade-up" data-anim-order="1">${c.description}</p>
        </div>
        <div class="mockup-device ${deviceClass}" data-anim="scale-in" data-anim-order="2">
          <div class="device-frame">${screenGradient}</div>
        </div>
      </div>`;
  },

  'fullscreen-image'(slide) {
    const c = slide.content;
    return `
      <div class="slide-inner fullscreen-inner" data-anim="clip-reveal" data-anim-order="0">
        <svg class="fullscreen-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fg-grad" cx="40%" cy="40%" r="70%">
              <stop offset="0%" stop-color="#f97316"/>
              <stop offset="40%" stop-color="#ef4444"/>
              <stop offset="100%" stop-color="#1e1b4b"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#fg-grad)"/>
        </svg>
        ${c.alt ? `<span class="sr-only">${c.alt}</span>` : ''}
      </div>`;
  },

  'thank-you'(slide) {
    const c = slide.content;
    const titleLines = c.title.split('\n').map(l => `<span class="line">${l}</span>`).join('');
    return `
      <div class="slide-inner thankyou-inner">
        <h2 class="hero-title" data-anim="split-lines" data-anim-order="0">${titleLines}</h2>
        ${c.description ? `<p class="hero-desc" data-anim="fade-up" data-anim-order="1">${c.description}</p>` : ''}
        ${c.cta ? `<a href="${c.cta.url}" class="cta-btn" data-anim="fade-up" data-anim-order="2">${c.cta.label}</a>` : ''}
      </div>`;
  },
};

export function renderSlide(slide) {
  const generator = templates[slide.type];
  if (!generator) {
    console.warn(`Unknown slide type: ${slide.type}`);
    return `<div class="slide-inner"><p>Unknown slide type: ${slide.type}</p></div>`;
  }
  return generator(slide);
}
