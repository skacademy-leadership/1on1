# LeadOn: 1on1 Coach 🎯

> AI 기반 리더십 코칭 및 1:1 면담 가이드 PWA

효과적인 1on1 대화를 위한 완벽한 가이드를 제공하는 Progressive Web App입니다. GROW+ 모델을 활용한 체계적인 대화법과 50가지 실무 사례, 상황별 맞춤 질문으로 리더의 소통 역량을 향상시킵니다.

## 🌟 주요 기능

### 📚 1on1 대화 절차 가이드
- **GROW+ 모델** 기반 체계적 대화법
- 단계별 상세 가이드와 핵심 질문
- 실무 적용을 위한 구체적 방법론

### 💼 상황별 1on1 대화 사례 (50가지)
- **성과 관리** (10가지 사례)
- **경력 개발** (10가지 사례) 
- **갈등 해결** (10가지 사례)
- **동기부여** (10가지 사례)
- **피드백** (10가지 사례)

### ❓ 1on1을 위한 질문 목록
- 라포 형성을 위한 질문
- 우선순위 확인을 위한 질문
- 생산성 향상을 위한 질문
- 경력 관리를 위한 질문
- 효과적인 질문 기법
- **최고의 질문 Top 5**

### 💡 자주 묻는 질문(FAQ)
- 1on1 운영 실무 팁
- 어려운 상황별 대응 방법
- 효과 측정 및 개선 방안

## 🚀 라이브 데모

### 🌐 배포된 사이트
- **Netlify**: [leadon-1on1-coach.netlify.app](https://leadon-1on1-coach.netlify.app) (추천)
- **GitHub Pages**: [username.github.io/leadon-1on1-coach](https://username.github.io/leadon-1on1-coach)

### 📱 PWA 설치
모든 기기에서 앱처럼 사용할 수 있습니다:
- **모바일**: 브라우저 메뉴 → "홈 화면에 추가"
- **데스크톱**: 주소창의 설치 아이콘 클릭

## 🛠️ 기술 스택

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **배포**: Netlify (자동 배포), GitHub Pages
- **스타일링**: CSS Grid, Flexbox, CSS Custom Properties
- **반응형**: Mobile-First 접근법

## 📱 지원 기기

### ✅ 완벽 지원
- iPhone (Safari, Chrome)
- iPad (Safari, Chrome)
- Android 폰/태블릿 (Chrome, Samsung Internet)
- 데스크톱 (Chrome, Firefox, Safari, Edge)

### 🎯 PWA 기능
- **오프라인 작동**: 인터넷 없이도 기본 기능 사용 가능
- **앱 설치**: 홈 화면에 추가하여 네이티브 앱처럼 사용
- **반응형 디자인**: 모든 화면 크기에 최적화
- **빠른 로딩**: Service Worker 캐싱으로 즉시 로딩

## 🏗️ 프로젝트 구조

```
leadon-1on1-coach/
├── 📁 public/
│   ├── manifest.json          # PWA 매니페스트
│   ├── favicon.ico           # 파비콘
│   └── 📁 icons/             # PWA 아이콘들
│       ├── icon-72x72.png
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── index.html                # 메인 HTML (완전한 SPA)
├── sw.js                     # Service Worker
├── netlify.toml             # Netlify 배포 설정
├── README.md                # 프로젝트 문서
└── .gitignore              # Git 무시 파일
```

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/[your-username]/leadon-1on1-coach.git
cd leadon-1on1-coach
```

### 2. 로컬 서버 실행
```bash
# Python 사용
python3 -m http.server 8000

# Node.js 사용
npx serve .

# PHP 사용
php -S localhost:8000
```

### 3. 브라우저에서 확인
```
http://localhost:8000
```

## 🌐 배포하기

### Netlify 배포 (권장)

**방법 1: Git 연동 (자동 배포)**
1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 선택
3. GitHub 저장소 연결
4. 설정:
   - **Build command**: `echo "Static PWA"`
   - **Publish directory**: `.` (루트)
5. 배포 완료! 🎉

**방법 2: 드래그 앤 드롭**
1. 프로젝트 폴더를 ZIP으로 압축
2. Netlify 대시보드에 드래그 앤 드롭
3. 즉시 배포 완료!

**방법 3: Netlify CLI**
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod --dir .
```

### GitHub Pages 배포

1. GitHub 저장소의 **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Save 후 배포 URL 확인

### 커스텀 도메인 설정

**Netlify에서:**
1. Site settings → Domain management
2. Add custom domain
3. DNS 설정 업데이트

## 🎨 커스터마이징

### 색상 테마 변경
CSS 변수를 수정하여 쉽게 테마 변경 가능:

```css
:root {
  --primary-color: #4A90E2;     /* 메인 색상 */
  --primary-light: #6BA3E8;     /* 밝은 메인 색상 */
  --primary-dark: #3A7BD5;      /* 어두운 메인 색상 */
  --accent-color: #FF6B6B;      /* 강조 색상 */
  --background-color: #F8F9FA;  /* 배경 색상 */
  --surface-color: #FFFFFF;     /* 카드 배경 */
  --text-primary: #2C3E50;      /* 주요 텍스트 */
  --text-secondary: #5D6D7E;    /* 보조 텍스트 */
}
```

### 콘텐츠 수정
- 모든 콘텐츠가 `index.html` 파일에 포함되어 있어 수정이 간단
- 사례, 질문, FAQ 등을 자유롭게 추가/수정 가능

### PWA 설정 수정
- `public/manifest.json`: 앱 이름, 색상, 아이콘 등
- `sw.js`: 캐싱 전략, 오프라인 동작 등

## 📊 성능 최적화

### Lighthouse 점수 목표
- **Performance**: 95+ 📊
- **Accessibility**: 100 ♿
- **Best Practices**: 100 ✅
- **SEO**: 95+ 🔍
- **PWA**: 100 📱

### 최적화 기법
- Service Worker 캐싱으로 즉시 로딩
- CSS/HTML 최적화 및 압축
- 이미지 지연 로딩 (필요시)
- 최소한의 JavaScript 사용

## 🤝 기여하기

프로젝트 개선에 참여해주세요!

1. 이 저장소를 Fork 합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 기여 가능한 영역
- 새로운 1on1 사례 추가
- 질문 목록 확장
- UI/UX 개선
- 접근성 향상
- 다국어 지원
- 오프라인 기능 확장

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- **콘텐츠 출처**: SK Academy Leadership 프로그램
- **디자인 영감**: Modern PWA Design Patterns
- **기술 지원**: Web Standards 및 PWA Best Practices

## 📞 지원 및 문의

- **이슈 리포트**: [GitHub Issues](https://github.com/[your-username]/leadon-1on1-coach/issues)
- **기능 요청**: [Feature Request](https://github.com/[your-username]/leadon-1on1-coach/issues/new?template=feature_request.md)
- **버그 리포트**: [Bug Report](https://github.com/[your-username]/leadon-1on1-coach/issues/new?template=bug_report.md)

---

## 📈 로드맵

### v1.1 (계획)
- [ ] 다크 모드 지원
- [ ] 검색 기능 추가
- [ ] 즐겨찾기 기능
- [ ] 개인 노트 기능 (로컬 저장)

### v1.2 (계획)
- [ ] 다국어 지원 (영어)
- [ ] 오디오 가이드
- [ ] 인터랙티브 체크리스트
- [ ] 진행률 추적

### v2.0 (계획)
- [ ] 백엔드 연동
- [ ] 사용자 계정 시스템
- [ ] 팀 관리 기능
- [ ] 분석 대시보드

---

**Happy Coaching! 🎯✨**

> *"훌륭한 리더는 질문을 통해 답을 찾아갑니다."*
