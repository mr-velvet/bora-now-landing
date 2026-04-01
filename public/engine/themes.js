// Theme definitions — applied as CSS custom properties per section
// Customized for Confia.vc brand colors

export const themes = {
  light: {
    '--bg': '#f0ede6',
    '--text': '#1a1a1a',
    '--text-secondary': 'rgba(26,26,26,0.6)',
    '--dot-color': '#1a1a1a',
    '--dot-active': '#1a1a1a',
  },
  dark: {
    '--bg': '#0a0a0a',
    '--text': '#f0ede6',
    '--text-secondary': 'rgba(240,237,230,0.55)',
    '--dot-color': '#f0ede6',
    '--dot-active': '#f0ede6',
  },
  accent: {
    '--bg': '#f5f0c8',
    '--text': '#1a1a1a',
    '--text-secondary': 'rgba(26,26,26,0.6)',
    '--dot-color': '#1a1a1a',
    '--dot-active': '#1a1a1a',
  },
};

export function applyTheme(sectionEl, themeName) {
  const vars = themes[themeName] || themes.light;
  for (const [prop, val] of Object.entries(vars)) {
    sectionEl.style.setProperty(prop, val);
  }
  sectionEl.dataset.theme = themeName;
}
