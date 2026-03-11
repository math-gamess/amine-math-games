import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // تأكد من وجود هذا السطر

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // وتأكد من إضافة هذه الوظيفة هنا
  ],
})
