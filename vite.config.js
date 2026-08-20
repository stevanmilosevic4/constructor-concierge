import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the same build works at
// https://stevanmilosevic4.github.io/constructor-concierge/ and at
// https://concierge.weareconstructor.com once DNS is in place.
export default defineConfig({
  base: './',
  plugins: [react()],
})
