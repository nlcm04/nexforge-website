/** @type {import('tailwindcss').Config} */
// Nexforge design tokens — sourced from NEXFORGE Brand Guidelines v1.3 (§3 Colour, §4 Typography).
// Colours are named by ROLE, not appearance, per the guidelines' token model.
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './preview.html'],
  theme: {
    // A deliberately shallow, decisive scale — no invented steps.
    extend: {
      colors: {
        forge: '#2E2116', // Forge Umber — the voice; all body copy & structure
        terra: '#6B4F35', // Terra Umber — secondary text
        ochre: '#D9A526', // Kiln Ochre — the accent, used almost nowhere
        paper: '#F4EFE6', // Paper — the ground
        card:  '#FCFAF5', // Paper-lift — cards/tables only
        bark:  '#4A3A2B', // Bark — secondary heads
        clay:  '#8A7660', // Clay — labels, folios, sources
        sand:  '#B3A28B', // Sand — rules, borders, dividers (non-text)
        linen: '#D5C9B6', // Linen — hairlines, table fills
        // Kiln Ochre ground scale (grounds only; never type on Paper)
        'ochre-10': '#FBEECF',
        'ochre-30': '#F2DB9A',
        'ochre-50': '#E8C566',
        'ochre-90': '#A87C18',
      },
      fontFamily: {
        sans:  ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      maxWidth: { measure: '42rem' }, // holds the 60–72ch measure (tightened)
      letterSpacing: {
        display: '-0.02em', // Display: −2%
        h1: '-0.014em',     // Heading 1: −1.4%
        h2: '-0.008em',     // Heading 2: −0.8%
        label: '0.16em',    // Label: +16%
        wordmark: '0.24em',
      },
      transitionTimingFunction: { brand: 'cubic-bezier(.2,.6,.2,1)' },
    },
  },
  plugins: [],
}
