import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite 8은 기본적으로 .jsx/.tsx 파일에만 JSX 파싱을 적용합니다.
// 이 플러그인이 .js 파일을 JSX로 파싱할 수 있도록 사전 변환합니다.
function jsAsJsx() {
  let config

  return {
    name: 'vite:js-as-jsx',
    enforce: 'pre',
    configResolved(resolved) {
      config = resolved
    },
    async transform(code, id) {
      if (id.includes('node_modules') || !id.match(/\/src\/[^?]*\.js$/)) return null
      return transformWithOxc(code, id, { lang: 'jsx' }, undefined, config)
    },
  }
}

export default defineConfig({
  plugins: [jsAsJsx(), react({ include: '**/*.{js,jsx}' }), tailwindcss()],
})
