import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import chatStubPlugin from './dev/chatStubPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  // chatStubPlugin only attaches under `vite dev` (apply: 'serve') — it's
  // a placeholder for the ChatWidget's /api/chat backend until a real one
  // exists. See dev/chatStubPlugin.js.
  plugins: [react(), chatStubPlugin()],
})
