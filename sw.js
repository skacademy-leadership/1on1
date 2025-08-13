// Service Worker for LeadOn 1on1 Coach PWA
const CACHE_NAME = 'leadon-1on1-coach-v1.0.0';
const OFFLINE_URL = './offline.html';

// 캐시할 정적 리소스들
const STATIC_CACHE_URLS = [
    './',
    './index.html',
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
    console.log('[SW] Service Worker 설치 중...');
    
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                
                // 필수 파일들 캐시
                console.log('[SW] 필수 파일 캐시 시작...');
                for (const url of STATIC_CACHE_URLS) {
                    try {
                        await cache.add(url);
                        console.log(`[SW] ✅ 캐시 성공: ${url}`);
                    } catch (error) {
                        console.warn(`[SW] ⚠️ 캐시 실패: ${url}`, error);
                    }
                }
                
                // 아이콘들 선택적 캐시
                console.log('[SW] 아이콘 파일 캐시 시작...');
                for (const url of ICON_CACHE_URLS) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            await cache.put(url, response);
                            console.log(`[SW] ✅ 아이콘 캐시 성공: ${url}`);
                        }
                    } catch (error) {
                        console.warn(`[SW] ⚠️ 아이콘 캐시 실패: ${url}`);
                    }
                }
                
                // 오프라인 페이지 생성
                await createOfflinePage(cache);
                
                console.log('[SW] ✅ Service Worker 설치 완료');
            } catch (error) {
                console.error('[SW] ❌ Service Worker 설치 실패:', error);
            }
        })()
    );
    
    // 즉시 활성화
    self.skipWaiting();
});

// Service Worker 활성화 이벤트
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker 활성화 중...');
    
    event.waitUntil(
        (async () => {
            try {
                // 이전 버전 캐시 삭제
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log(`[SW] 🗑️ 이전 캐시 삭제: ${name}`);
                            return caches.delete(name);
                        })
                );
                
                // 모든 클라이언트에서 즉시 제어
                await self.clients.claim();
                console.log('[SW] ✅ Service Worker 활성화 완료');
                
                // 클라이언트에게 업데이트 알림
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        message: 'LeadOn 1on1 Coach가 업데이트되었습니다!'
                    });
                });
                
            } catch (error) {
                console.error('[SW] ❌ Service Worker 활성화 실패:', error);
            }
        })()
    );
});

// 네트워크 요청 인터셉트
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // GET 요청만 처리
    if (request.method !== 'GET') {
        return;
    }
    
    // 같은 오리진의 요청만 처리
    if (!request.url.includes(self.location.origin)) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

// 요청 처리 함수
async function handleRequest(request) {
    try {
        // 캐시 우선 전략
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // 백그라운드에서 업데이트 확인
            updateCacheInBackground(request, cache);
            return cachedResponse;
        }
        
        // 네트워크에서 가져오기
        const networkResponse = await fetch(request);
        
        // 성공적인 응답이면 캐시에 저장
        if (networkResponse && networkResponse.status === 200) {
            if (shouldCache(request.url)) {
                const responseToCache = networkResponse.clone();
                await cache.put(request, responseToCache);
            }
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('[SW] ❌ Fetch 에러:', error);
        
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
        return createBasicOfflineResponse();
    }
}

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
        console.log('[SW] 백그라운드 캐시 업데이트 실패:', error.message);
    }
}

// 오프라인 페이지 생성
async function createOfflinePage(cache) {
    const offlineHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오프라인 - LeadOn 1on1 Coach</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #4A90E2 0%, #3A7BD5 100%);
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        h1 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: 600;
        }
        p {
            font-size: 1rem;
            margin-bottom: 25px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .features {
            margin-bottom: 25px;
            text-align: left;
        }
        .feature {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .feature:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #27AE60;
            font-weight: bold;
        }
        .button {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🎯</div>
        <h1>LeadOn 1on1 Coach</h1>
        <p>인터넷 연결이 필요합니다</p>
        
        <div class="features">
            <div class="feature">캐시된 콘텐츠 이용 가능</div>
            <div class="feature">오프라인에서도 기본 기능 제공</div>
            <div class="feature">연결 복구 시 자동 동기화</div>
        </div>
        
        <button class="button" onclick="window.location.reload()">
            🔄 다시 시도
        </button>
    </div>
</body>
</html>
    `;
    
    const response = new Response(offlineHTML, {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    });
    
    await cache.put(OFFLINE_URL, response);
}

// 기본 오프라인 응답 생성
function createBasicOfflineResponse() {
    return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
            <title>오프라인 - LeadOn</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    text-align: center; 
                    padding: 50px; 
                    background: #4A90E2;
                    color: white;
                    margin: 0;
                }
                .icon { font-size: 64px; margin-bottom: 20px; }
                h1 { color: white; margin-bottom: 20px; }
                button { 
                    background: rgba(255,255,255,0.2); 
                    color: white; 
                    border: 1px solid rgba(255,255,255,0.3); 
                    padding: 12px 24px; 
                    border-radius: 6px; 
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="icon">🎯</div>
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
                'Content-Type': 'text/html; charset=utf-8'
            })
        }
    );
}

// 메시지 이벤트 리스너
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 에러 처리
self.addEventListener('error', (event) => {
    console.error('[SW] Service Worker 에러:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Service Worker Promise 에러:', event.reason);
    event.preventDefault();
});

console.log('🚀 LeadOn 1on1 Coach Service Worker 로드 완료');
