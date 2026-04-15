import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00488d',
        'primary-container': '#005fb8',
        'on-primary': '#ffffff',
        'primary-fixed-dim': '#a8c8ff',
        surface: '#fbf9f8',
        'surface-container': '#efeded',
        'surface-container-low': '#f5f3f3',
        'surface-container-high': '#e9e8e7',
        'surface-container-highest': '#e4e2e2',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#424752',
        outline: '#727783',
        'outline-variant': '#c2c6d4',
        error: '#ba1a1a',
        secondary: '#486176',
        'secondary-container': '#cbe6ff',
        'on-secondary-container': '#4e677c',
        tertiary: '#7b3200',
        'tertiary-container': '#a04401',
        'on-tertiary-container': '#ffd1bc',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
