import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// 앱을 폰에 설치할 수 있게 하는 PWA 설정. 자세한 내용은 docs/PWA.md
const pwa = VitePWA({
  // 새 버전을 배포하면 다음에 앱을 열 때 자동으로 바뀐다.
  registerType: 'autoUpdate',

  // 홈 화면에 설치했을 때의 앱 정보
  manifest: {
    id: '/',
    name: '내 차 수첩',
    short_name: '내 차 수첩',
    description: '주행거리와 소모품 교체를 기록하는 자동차 수첩',
    lang: 'ko',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f4f2fc',
    theme_color: '#f4f2fc',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },

  workbox: {
    // 앱 화면을 이루는 파일은 설치할 때 미리 저장해서 인터넷 없이도 열리게 한다.
    globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
    navigateFallback: '/index.html',
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        // 폰트 파일: 한 번 받으면 오래 쓴다.
        urlPattern: ({ url }) =>
          url.origin === 'https://cdn.jsdelivr.net' ||
          url.origin === 'https://fonts.googleapis.com' ||
          url.origin === 'https://fonts.gstatic.com',
        handler: 'CacheFirst',
        options: {
          cacheName: 'fonts',
          expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Supabase(로그인, 기록)는 일부러 저장하지 않는다. 항상 서버의 최신 기록을 받아야 하기 때문이다.
    ],
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), pwa],
  // Vercel에서 사이트 맨 위 주소(/)로 배포한다. 서비스 워커 경로가 꼬이지 않게 절대 경로를 쓴다.
  base: '/',
});
