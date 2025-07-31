// Utility Functions for Hello World PWA

// 기기 감지 유틸리티
const DeviceUtils = {
    // 모바일 기기 감지
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 태블릿 감지
    isTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    },
    
    // iOS 감지
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },
    
    // Android 감지
    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },
    
    // Safari 감지
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    
    // Chrome 감지
    isChrome() {
        return /Chrome/i.test(navigator.userAgent) && !this.isEdge();
    },
    
    // Edge 감지
    isEdge() {
        return /Edg/i.test(navigator.userAgent);
    },
    
    // 터치 지원 감지
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // 화면 크기 정보
    getScreenSize() {
        return {
            ...screen,
            category,
            isMobile: this.isMobile(),
            isTablet: this.isTablet(),
            isTouchDevice: this.isTouchDevice()
        };
    }
};

// 날짜/시간 유틸리티
const DateUtils = {
    // 현재 시간 포맷팅
    formatCurrentTime(format = 'YYYY-MM-DD HH:mm:ss') {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    // 상대 시간 표시
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return '방금 전';
    }
};

// 스토리지 유틸리티
const StorageUtils = {
    // 로컬 스토리지 (PWA에서는 사용 제한적)
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.warn('LocalStorage 저장 실패:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('LocalStorage 읽기 실패:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('LocalStorage 삭제 실패:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('LocalStorage 초기화 실패:', error);
            return false;
        }
    }
};

// 네트워크 유틸리티
const NetworkUtils = {
    // 온라인 상태 확인
    isOnline() {
        return navigator.onLine;
    },
    
    // 네트워크 정보 (지원되는 경우)
    getNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    },
    
    // 느린 연결 감지
    isSlowConnection() {
        const info = this.getNetworkInfo();
        if (!info) return false;
        
        return info.effectiveType === 'slow-2g' || 
               info.effectiveType === '2g' || 
               info.saveData === true;
    }
};

// 성능 유틸리티
const PerformanceUtils = {
    // 성능 측정 시작
    startMeasure(name) {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(`${name}-start`);
        }
    },
    
    // 성능 측정 종료
    endMeasure(name) {
        if ('performance' in window && 'mark' in performance && 'measure' in performance) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            
            const measure = performance.getEntriesByName(name)[0];
            return measure ? measure.duration : 0;
        }
        return 0;
    },
    
    // 메모리 사용량 (지원되는 경우)
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
            };
        }
        return null;
    }
};

// DOM 유틸리티
const DOMUtils = {
    // 요소가 뷰포트에 보이는지 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 부드러운 스크롤
    smoothScrollTo(target, duration = 500) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    },
    
    // 클래스 토글
    toggleClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
            return false;
        } else {
            element.classList.add(className);
            return true;
        }
    }
};

// 색상 유틸리티
const ColorUtils = {
    // HEX를 RGB로 변환
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // RGB를 HEX로 변환
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // 색상 밝기 계산
    getBrightness(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return 0;
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    
    // 다크/라이트 모드에 적합한 색상 반환
    getContrastColor(hex) {
        return this.getBrightness(hex) > 128 ? '#000000' : '#FFFFFF';
    }
};

// 유효성 검사 유틸리티
const ValidationUtils = {
    // 이메일 유효성 검사
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // URL 유효성 검사
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // 휴대폰 번호 유효성 검사 (한국)
    isValidPhoneKR(phone) {
        const re = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        return re.test(phone);
    }
};

// 디바운스/스로틀 유틸리티
const FunctionUtils = {
    // 디바운스
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // 스로틀
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 전역으로 내보내기
window.DeviceUtils = DeviceUtils;
window.DateUtils = DateUtils;
window.StorageUtils = StorageUtils;
window.NetworkUtils = NetworkUtils;
window.PerformanceUtils = PerformanceUtils;
window.DOMUtils = DOMUtils;
window.ColorUtils = ColorUtils;
window.ValidationUtils = ValidationUtils;
window.FunctionUtils = FunctionUtils;

console.log('✅ Utils 모듈 로드 완료');width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    },
    
    // 뷰포트 정보
    getViewport() {
        const screen = this.getScreenSize();
        let category = 'desktop';
        
        if (screen.width <= 480) category = 'mobile';
        else if (screen.width <= 768) category = 'tablet';
        else if (screen.width <= 1024) category = 'small-desktop';
        else category = 'desktop';
        
        return {