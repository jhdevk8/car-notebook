import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base를 상대 경로로 두면 GitHub Pages 하위 경로에 올려도 파일을 찾을 수 있다.
export default defineConfig({
  plugins: [react()],
  base: './',
});
