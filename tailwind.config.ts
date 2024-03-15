import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      light: '#F5F5F5',
      primary: '#FAA916',
      dark: '#171717',
      grey: '#8E8E8E',
      'semi-dark': '#343434',
    },
    fontFamily: {
      sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'arrow-up': "url('~/public/images/arrowUp.svg')",
        'arrow-hover': "url('~/public/images/arrowUpHover.svg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
