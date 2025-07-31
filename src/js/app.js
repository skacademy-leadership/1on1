// Main App JavaScript
class PWAApp {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.currentPage = 'home';
        
        this.init();
    }
    
    async init() {
        // 로딩 완료 후 앱 표시
        await this.simulateLoading();
        this.showApp();
        
        // PWA 기능 초기화
        this.initPWA();
        this.initEventListeners();
        this.checkInstallStatus();
        
        console.log('🎯 Hello World PWA 초기화 완료!');
    }
    
    // 로딩 시뮬레이션
    async simulateLoading() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }
    
    // 앱 표시
    showApp() {
        const loading = document.getElementById('loading');
        const app = document.getElementById('app');
        
        if (loading) loading.style.display = 'none';
        if (app) app.style.display = 'flex';
    }
    
    // PWA 초기화
    async initPWA() {
        // Service Worker 등록
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker 등록 성공:', registration);
                
                // 업데이트 확인
                registration.addEventListener('updatefound', () => {
                    console.log('새로운 버전이 발견되었습니다.');
                    this.showUpdateNotification();
                });
            } catch (error) {
                console.error('Service Worker 등록 실패:', error);
            }
        }
        
        // 설치 프롬프트 이벤트 리스너
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // 앱 설치 완료 이벤트
        window.addEventListener('appinstalled', () => {
            console.log('PWA가 설치되었습니다!');
            this.isInstalled = true;
            this.hideInstallPrompt();
            this.showToast('앱이 성공적으로 설치되었습니다! 🎉');
        });
    }
    
    // 이벤트 리스너 초기화
    initEventListeners() {
        // 설치 버튼
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-btn');
        
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => this.hideInstallPrompt());
        }
        
        // 온라인/오프라인 상태 감지
        window.addEventListener('online', () => {
            this.showToast('인터넷에 연결되었습니다! 🌐');
        });
        
        window.addEventListener('offline', () => {
            this.showToast('오프라인 모드입니다. 📱');
        });
        
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            // ESC 키로 설치 프롬프트 닫기
            if (e.key === 'Escape') {
                this.hideInstallPrompt();
            }
        });
    }
    
    // 설치 상태 확인
    checkInstallStatus() {
        // PWA 설치 여부 확인
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA가 설치된 상태입니다.');
        }
    }
    
    // 설치 프롬프트 표시
    showInstallPrompt() {
        if (this.isInstalled) return;
        
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'block';
        }
    }
    
    // 설치 프롬프트 숨기기
    hideInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'none';
        }
    }
    
    // 앱 설치
    async installApp() {
        if (!this.deferredPrompt) return;
        
        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('사용자가 설치를 수락했습니다.');
            } else {
                console.log('사용자가 설치를 거부했습니다.');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        } catch (error) {
            console.error('설치 중 오류:', error);
            this.showToast('설치 중 오류가 발생했습니다. 😥');
        }
    }
    
    // 업데이트 알림 표시
    showUpdateNotification() {
        const updateToast = this.createToast(
            '새로운 버전이 있습니다! 페이지를 새로고침하세요. 🔄',
            'info',
            0 // 자동 사라지지 않음
        );
        
        // 새로고침 버튼 추가
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-primary';
        refreshBtn.textContent = '새로고침';
        refreshBtn.onclick = () => window.location.reload();
        
        updateToast.appendChild(refreshBtn);
        document.body.appendChild(updateToast);
    }
    
    // 토스트 메시지 표시
    showToast(message, type = 'success', duration = 3000) {
        const toast = this.createToast(message, type, duration);
        document.body.appendChild(toast);
        
        // 자동 제거
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, duration);
        }
    }
    
    // 토스트 엘리먼트 생성
    createToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // 토스트 스타일 추가 (동적으로)
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: var(--spacing-lg);
                    right: var(--spacing-lg);
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    z-index: var(--z-toast);
                    animation: slideInRight var(--transition-normal);
                    max-width: 400px;
                }
                .toast-content {
                    padding: var(--spacing-lg);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-md);
                }
                .toast-message {
                    color: var(--text-primary);
                    font-weight: var(--font-weight-medium);
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: var(--font-size-lg);
                    cursor: pointer;
                    padding: 0;
                    color: var(--text-muted);
                    min-width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .toast-close:hover {
                    color: var(--text-primary);
                }
                .toast-success { border-left: 4px solid var(--success-color); }
                .toast-error { border-left: 4px solid var(--error-color); }
                .toast-warning { border-left: 4px solid var(--warning-color); }
                .toast-info { border-left: 4px solid var(--primary-color); }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @media (max-width: 640px) {
                    .toast {
                        left: var(--spacing-md);
                        right: var(--spacing-md);
                        top: var(--spacing-md);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        return toast;
    }
}

// 페이지 네비게이션 함수 (전역)
function navigateTo(page) {
    console.log(`${page} 페이지로 이동`);
    
    // 실제 구현에서는 SPA 라우팅 또는 페이지 이동
    switch (page) {
        case 'home':
            app.showToast('홈 페이지입니다! 🏠');
            break;
        case 'about':
            app.showToast('소개 페이지로 이동합니다! ℹ️');
            break;
        case 'contact':
            app.showToast('연락처 페이지로 이동합니다! 📞');
            break;
        default:
            app.showToast('페이지를 찾을 수 없습니다. 😅');
    }
}

// 앱 인스턴스 생성 및 전역 변수로 설정
let app;

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    app = new PWAApp();
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('앱 에러:', e.error);
    if (app) {
        app.showToast('오류가 발생했습니다. 다시 시도해주세요. 😥', 'error');
    }
});

// 처리되지 않은 Promise 에러 핸들링
window.addEventListener('unhandledrejection', (e) => {
    console.error('처리되지 않은 Promise 에러:', e.reason);
    if (app) {
        app.showToast('처리 중 오류가 발생했습니다. 😥', 'error');
    }
    e.preventDefault();
});