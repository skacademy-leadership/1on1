# 1on1
# Hello World PWA 🎯

다양한 기기에서 최적화된 Progressive Web App입니다.

## ✨ 주요 기능

- **📱 크로스 플랫폼 지원**: PC, 태블릿, 아이패드, 안드로이드폰, 아이폰 모두 지원
- **🎨 반응형 디자인**: 모든 화면 크기에 최적화
- **⚡ PWA 기능**: 오프라인 작동, 앱 설치, 푸시 알림 지원
- **🎭 통합 디자인 시스템**: 하나의 파일로 전체 디자인 관리
- **🌙 다크모드 지원**: 시스템 설정에 따른 자동 테마 변경
- **♿ 접근성**: WCAG 가이드라인 준수

## 🏗️ 프로젝트 구조

```
1on1/
├── public/                    # 정적 자원
│   ├── manifest.json         # PWA 매니페스트
│   ├── favicon.ico          # 파비콘
│   └── icons/               # 다양한 크기의 앱 아이콘
├── src/
│   ├── css/                 # 스타일시트
│   │   ├── design-system.css   # 🎨 전체 디자인 시스템 정의
│   │   ├── components.css      # 재사용 가능한 컴포넌트
│   │   └── responsive.css      # 반응형 디자인
│   ├── js/                  # JavaScript
│   │   ├── app.js             # 메인 앱 로직
│   │   ├── components.js      # UI 컴포넌트
│   │   └── utils.js          # 유틸리티 함수
│   └── pages/               # 추가 페이지들
├── sw.js                    # Service Worker
├── index.html              # 메인 HTML
├── netlify.toml           # Netlify 배포 설정
└── README.md
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/skacademy-leadership/1on1.git
cd 1on1
```

### 2. 로컬 서버 실행

Python 사용:
```bash
python3 -m http.server 8000
```

Node.js 사용:
```bash
npx serve .
```

### 3. 브라우저에서 확인

`http://localhost:8000`으로 접속

## 🌐 배포하기

### Netlify 배포

1. GitHub에 코드 푸시
2. [Netlify](https://netlify.com)에 로그인
3. "New site from Git" 선택
4. 저장소 연결
5. 자동 배포 완료!

또는 드래그 앤 드롭으로 배포:
1. 프로젝트 폴더를 ZIP으로 압축
2. Netlify 대시보드에 드래그 앤 드롭

### GitHub Pages 배포

1. 저장소의 **Settings** > **Pages** 이동
2. Source를 **Deploy from a branch** 선택
3. Branch를 **main**, 폴더를 **/ (root)** 선택
4. Save 후 배포 URL 확인: `https://skacademy-leadership.github.io/1on1/`

## 🎨 디자인 시스템 수정

전체 앱의 디자인을 변경하려면 `src/css/design-system.css` 파일만 수정하면 됩니다:

```css
:root {
  /* 색상 변경 */
  --primary-color: #4A90E2;     /* 메인 색상 */
  --background-color: #F8F9FA;  /* 배경 색상 */
  
  /* 폰트 크기 변경 */
  --font-size-lg: 1.125rem;
  
  /* 간격 조정 */
  --spacing-lg: 1.5rem;
}
```

## 📱 PWA 기능

### 앱 설치
- 브라우저에서 "홈 화면에 추가" 선택
- 또는 주소창의 설치 아이콘 클릭

### 오프라인 지원
- Service Worker가 자동으로 필요한 파일들을 캐시
- 인터넷 연결이 없어도 기본 기능 사용 가능

### 푸시 알림 (확장 가능)
```javascript
// 알림 권한 요청
if ('Notification' in window) {
  Notification.requestPermission();
}
```

## 🔧 커스터마이징

### 새로운 페이지 추가

1. `src/pages/` 폴더에 HTML 파일 생성
2. `src/js/app.js`의 `navigateTo` 함수에 라우팅 추가
3. 메인 페이지에 네비게이션 카드 추가

### 새로운 컴포넌트 추가

`src/js/components.js`에 클래스 추가:
```javascript
class MyComponent {
  constructor(options = {}) {
    // 컴포넌트 로직
  }
}
```

### 유틸리티 함수 추가

`src/js/utils.js`에 함수 추가:
```javascript
const MyUtils = {
  myFunction() {
    // 유틸리티 함수
  }
};
```

## 🎯 지원 기기

### 모바일
- ✅ iPhone (Safari, Chrome)
- ✅ Android (Chrome, Samsung Internet)
- ✅ iPad (Safari, Chrome)

### 데스크톱
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### 태블릿
- ✅ iPad
- ✅ Android 태블릿
- ✅ Surface

## 🐛 문제 해결

### PWA가 설치되지 않을 때
1. HTTPS로 접속하는지 확인
2. `manifest.json` 파일이 올바른지 확인
3. Service Worker가 등록되었는지 확인

### 오프라인에서 작동하지 않을 때
1. 브라우저 개발자 도구 > Application > Service Workers 확인
2. 캐시 상태 확인
3. 네트워크 탭에서 Service Worker 요청 확인

### 디자인이 적용되지 않을 때
1. CSS 파일 경로 확인
2. 브라우저 캐시 새로고침 (Ctrl+F5)
3. 개발자 도구에서 CSS 로드 확인

## 📊 성능 최적화

### Lighthouse 점수 개선
- PWA: 100/100
- Performance: 95+/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 95+/100

### 최적화 팁
1. 이미지 압축 및 WebP 포맷 사용
2. CSS/JS 파일 압축
3. 불필요한 리소스 제거
4. 캐시 전략 최적화

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다.

## 🙏 감사의 말

- 디자인 영감: [SK Academy Mentor Guide](https://skacademy-mentor-guide.netlify.app/setup.html)
- 아이콘: 시스템 이모지 사용
- PWA 기능: Web APIs 표준 준수

---

## 📞 지원

문제가 있거나 궁금한 점이 있으시면 이슈를 생성해 주세요.

**Happy coding! 🎉**