import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@rollup/plugin-yaml'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Everything (JS, CSS, fonts, logos, YAML data) is inlined into dist/index.html
// so the result is one self-contained file that GitHub Pages can serve.
export default defineConfig({
  base: './',
  plugins: [vue(), yaml(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000_000,
  },
})
