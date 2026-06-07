// Per-project accent palettes for the research section.
// Each page wraps itself in ResearchLayout theme="..." which sets these
// as CSS custom properties on the root, so components read --accent etc.

export const THEMES = {
  capitalism: {
    accent: '#1f5a43', // deep archival green
    accentSoft: '#e2ebe2',
    accentInk: '#123528',
    accentRgb: '31, 90, 67',
    neg: '#9b2d2d',
    heroBg: '#10271f',
    label: 'Comparative Capitalism',
  },
  innovation: {
    accent: '#b4541f', // copper / amber
    accentSoft: '#f3e4d4',
    accentInk: '#6e3110',
    accentRgb: '180, 84, 31',
    neg: '#3a5a8c',
    heroBg: '#2a1a10',
    label: 'Growth & Innovation',
  },
  inequality: {
    accent: '#9b2d2d', // oxblood
    accentSoft: '#f0ddd9',
    accentInk: '#5e1a1a',
    accentRgb: '155, 45, 45',
    neg: '#2f5d8c', // steel — diverging counterpart
    heroBg: '#27140f',
    label: 'Inequality & Prosperity',
  },
};

export function themeVars(name) {
  const t = THEMES[name] || THEMES.capitalism;
  return {
    '--accent': t.accent,
    '--accent-soft': t.accentSoft,
    '--accent-ink': t.accentInk,
    '--accent-rgb': t.accentRgb,
    '--neg': t.neg,
  };
}
