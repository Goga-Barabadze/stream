import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from "url"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'webtorrent': fileURLToPath(new URL('./node_modules/webtorrent/dist/webtorrent.min.js', import.meta.url)),
    },
  }
})
