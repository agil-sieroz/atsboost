import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Semua file di folder app
    "./components/**/*.{js,ts,jsx,tsx}", // Semua file di folder components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;