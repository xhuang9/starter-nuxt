export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
  safelist: [
    {
      pattern: /bg-slate-.+/,
      variants: ['lg', 'md', 'sm']
    },
    {
      pattern: /rounded-.+/,
      variants: ['lg', 'md', 'sm']
    },
    {
      pattern: /text-.+/,
      variants: ['lg', 'md', 'sm']
    },
    {
      pattern: /my-.+/,
      variants: ['lg', 'md', 'sm']
    },
    {
      pattern: /p-.+/,
      variants: ['lg', 'md', 'sm']
    },
    'aspect-w-16',
    'aspect-h-9'
  ]
}