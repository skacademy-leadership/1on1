// Service Worker for Hello World PWA (GitHub Pages)
const CACHE_NAME = 'hello-world-pwa-v1.0.0';
const OFFLINE_URL = './index.html';

// GitHub Pages 경로를 고려한 캐시 파일들
const STATIC_CACHE_URLS = [
    './',
    './index.html',
    './src/css/design-system.css',
    './src/css/components.css',
    './src/css/responsive.css',
    './src/js/app.js',
    './src/js/components.js',
    './src/js/utils.js',
    './public/manifest.json'
];

// 아이콘 파일들 (존재하는 경우에만 캐시)
const ICON_CACHE_URLS = [
    './public/icons/icon-72x72.png',
    './public/icons/icon-96x96.png',
    './public/icons/icon-128x128.png',
    './public/icons/icon-144x144.png',
    './public/icons/icon-152x152.png',
    './public/icons/icon-192x192.png',
    './public/icons/icon-384x384.png',
    './public/icons/icon-512x512.png',
    './public/favicon.ico'
];

// Service Worker 설치 이벤트
self.addEventListener('install', (event) => {
    console.log('Service Worker 설치 중...');
    
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                
                // 필수 파일들 먼저 캐시
                console.log('필수 파일들 캐시 시작...');
                for (const url of STATIC_CACHE_URLS) {
                    try {
                        await cache.add(url);
                        console.log(`캐시 성공: ${url}`);
                    } catch (error) {
                        console.warn(`캐시 실패: ${url}`, error);
                    }
                }
                
                // 아이콘들은 선택적으로 캐시 (실패해도 진행)
                console.log('아이콘 파일들 캐시 시작...');
                for (const url of ICON_CACHE_URLS) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            await cache.put(url, response);
                            console.log(`아이콘 캐시 성공: ${url}`);
                        }
                    } catch (error) {
                        console.warn(`아이콘 캐시 실패: ${url}`, error);
                    }
                }
                
                console.log('Service Worker 설치 완료');
            } catch (error) {
                console.error('Service Worker 설치 실패:', error);
            }
        })()
    );
    
    // 즉시 활성화
    self.skipWaiting();
});

// Service Worker 활성화 이벤트
self.addEventListener('activate', (event) => {
    console.log('Service Worker 활성화 중...');
    
    event.waitUntil(
        (async () => {
            try {
                // 이전 버전 캐시 삭제
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log(`이전 캐시 삭제: ${name}`);
                            return caches.delete(name);
                        })
                );
                
                // 모든 클라이언트에서 즉시 제어
                await self.clients.claim();
                console.log('Service Worker 활성화 완료');
            } catch (error) {
                console.error('Service Worker 활성화 실패:', error);
            }
        })()
    );
});

// 네트워크 요청 인터셉트 (GitHub Pages 최적화)
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // POST 요청이나 외부 요청은 처리하지 않음
    if (request.method !== 'GET') {
        return;
    }
    
    // GitHub Pages 도메인이 아닌 요청은 처리하지 않음
    if (!request.url.includes(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        (async () => {
            try {
                // 캐시에서 먼저 찾기
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(request);
                
                if (cachedResponse) {
                    // 백그라운드에서 업데이트 확인 (GitHub Pages는 업데이트가 빈번하지 않음)
                    updateCacheInBackground(request, cache);
                    return cachedResponse;
                }
                
                // 네트워크에서 가져오기
                const networkResponse = await fetch(request);
                
                // 성공적인 응답이면 캐시에 저장
                if (networkResponse && networkResponse.status === 200) {
                    // GitHub Pages 특성상 정적 파일만 캐시
                    if (shouldCache(request.url)) {
                        const responseToCache = networkResponse.clone();
                        await cache.put(request, responseToCache);
                    }
                }
                
                return networkResponse;
                
            } catch (error) {
                console.error('Fetch 에러:', error);
                
                // 오프라인일 때 HTML 요청이면 캐시된 메인 페이지 반환
                if (request.destination === 'document') {
                    const cache = await caches.open(CACHE_NAME);
                    const offlineResponse = await cache.match(OFFLINE_URL) || 
                                          await cache.match('./') ||
                                          await cache.match('./index.html');
                    
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }
                
                // 기본 오프라인 응답
                return new Response(
                    `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>오프라인</title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { 
                                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                                text-align: center; 
                                padding: 50px; 
                                color: #333;
                            }
                            .offline-icon { font-size: 64px; margin-bottom: 20px; }
                            h1 { color: #666; }
                            button { 
                                background: #4A90E2; 
                                color: white; 
                                border: none; 
                                padding: 12px 24px; 
                                border-radius: 6px; 
                                cursor: pointer;
                                font-size: 16px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="offline-icon">📱</div>
                        <h1>인터넷 연결이 필요합니다</h1>
                        <p>네트워크 연결을 확인하고 다시 시도해주세요.</p>
                        <button onclick="window.location.reload()">다시 시도</button>
                    </body>
                    </html>
                    `,
                    {
                        status: 200,
                        statusText: 'OK',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    }
                );
            }
        })()
    );
});

// 캐시 가능한 파일 확인
function shouldCache(url) {
    const cacheableExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.json'];
    return cacheableExtensions.some(ext => url.includes(ext)) || url.endsWith('/');
}

// 백그라운드에서 캐시 업데이트
async function updateCacheInBackground(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            await cache.put(request, networkResponse.clone());
        }
    } catch (error) {
        // 백그라운드 업데이트 실패는 무시
        console.log('백그라운드 캐시 업데이트 실패:', error.message);
    }
}

// 메시지 이벤트 리스너
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 에러 처리
self.addEventListener('error', (event) => {
    console.error('Service Worker 에러:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker Promise 에러:', event.reason);
    event.preventDefault();
});

console.log('🚀 Service Worker 스크립트 로드 완료 (GitHub Pages)');