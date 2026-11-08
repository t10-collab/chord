# 🎵 음표 & 쉼표 마스터! (신나는 음악 기호 모험)

> **중학교 1~2학년 음악 수업을 위한 인터랙티브 게임형 교육 웹 애플리케이션**  
> 학생들이 가장 헷갈려 하는 온음표, 점2분음표, 2분음표, 4분음표, 8분음표, 16분음표 및 각종 쉼표(특히 온쉼표 vs 2분쉼표!)를 게임과 소리로 쉽고 재미있게 마스터할 수 있습니다.

---

## 🌟 1. 프로젝트 소개 및 핵심 기능

### 🎯 대상 및 목적
- **대상**: 중학교 1~2학년 학생 (개인 또는 모둠별 활동)
- **수업 연계**: 중학교 음악과 교육과정 [음악 요소와 개념] - 음표와 쉼표의 이름, 모양, 박자 길이 이해 및 박자 셈하기

### 🚀 주요 기능
1. **간편한 모둠/닉네임 참여**:
   - 별도 회원가입 없이 닉네임 또는 모둠명(예: *1모둠*, *피아노냥*)만 입력하면 즉시 모험 시작.
   - **개인정보 보호 안내**: 실명 및 연락처 입력을 원천 방지하는 친절한 가이드 제공.
2. **이론 학습 도감 (소리 청취 기능 탑재)**:
   - 총 14종의 음표 및 쉼표 고화질 벡터 SVG 그래픽.
   - **시험 단골 1위**: *2분쉼표(모자 모양/셋째 줄 위)* vs *온쉼표(세숫대야 모양/넷째 줄 아래)* 완벽 비교 비법 수록.
   - **박자 들어보기 버튼**: Web Audio API 기반 신시사이저로 각 음표의 실제 지속 시간(4박, 2박, 1박, 0.5박 등)을 소리로 직접 체감.
3. **4단계 게임 모드 & 신나는 종합 모험**:
   - **1단계 (기호 이름 맞추기)**: 모양을 보고 올바른 이름 고르기 & 이름을 보고 알맞은 기호 찾기 (4지선다).
   - **2단계 (박자 길이 맞추기)**: 각 기호가 몇 박자인지 맞히기 (말리듬 학습 포함).
   - **3단계 (음표 계산 마스터)**: ♩ + ♪ = 몇 박자? 시각적 기호 수식 퀴즈.
   - **4단계 (높은음자리표 계이름 & 음이름)**: 오선보 줄음(미-솔-시-레-파), 칸음(파-라-도-미), 가온 도(C4)~높은 솔(G5) 완벽 마스터.
   - **종합 모험**: 1~4단계 12문제 풀코스 챔피언십 챌린지.
4. **게임 요소 & 피드백**:
   - **정답 시 실시간 폭죽(Confetti) 이펙트**: 문제를 맞힐 때마다 화려한 축하 폭죽이 터지며, 3콤보 이상 시 좌우 듀얼 폭죽 발사!
   - **키보드 단축키 지원**: 숫자키 `1, 2, 3, 4`로 즉각 선택 및 `Space`로 다음 문제 진행 가능 (몰입도 극대화).
   - 15초 카운트다운 타이머 & 째깍 비프음.
   - 연속 정답 시 콤보(COMBO) 시스템 & 점진적 음정 상승 효과음.
   - 문제 풀이 직후 핵심 학습 팁과 해설 팝업.
   - 최종 결과 화면 축하 팡파레 & 꽃가루 이펙트.
5. **실시간 랭킹 시스템 (Cloud Firestore & 로컬 폴백)**:
   - Firestore `scores` 컬렉션의 실시간 스냅샷(`onSnapshot`) 연동.
   - Firebase 미설정 환경에서도 LocalStorage를 통해 100% 정상 작동하는 안전한 데모 모드 지원.
6. **교사 관리자 모드 (비밀번호: `1234`)**:
   - 학생 제출 기록 실시간 조회 및 모둠별 검색.
   - 반별 수업 종료 후 **랭킹 데이터 전체 초기화** 원클릭 지원.
   - 수업 성적 기록을 위한 **CSV (엑셀 호환) 내보내기** 기능 제공.

---

## 🛠️ 2. 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide-react, Motion, canvas-confetti
- **Audio Engine**: Native Web Audio API (외부 음원 파일 없이 브라우저 자체 합성)
- **Database / Backend**: Firebase Cloud Firestore, Firebase Authentication (익명 인증 지원)
- **Build Tool**: Vite

---

## 🔒 3. Firestore Security Rules (보안 규칙)

Firebase Console > **Firestore Database** > **규칙(Rules)** 탭에 아래 코드를 복사하여 게시합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{scoreId} {
      // 1. 누구나 리더보드 순위를 실시간으로 조회(읽기)할 수 있습니다.
      allow read: if true;

      // 2. 새로운 점수 등록(쓰기): 필드 유효성 및 데이터 무결성 검증
      allow create: if request.resource.data.nickname is string
                    && request.resource.data.nickname.size() >= 1
                    && request.resource.data.nickname.size() <= 30
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.score <= 100000;

      // 3. 학생이 임의로 점수를 수정하지 못하도록 차단 (교사/관리자만 삭제 가능)
      allow update: if false;
      allow delete: if request.auth != null;
    }
  }
}
```

---

## ⚙️ 4. Firebase 설정 가이드 (Step-by-Step)

### Step 1: Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속하여 구글 계정으로 로그인합니다.
2. **프로젝트 추가**를 클릭하고 프로젝트 이름(예: `music-symbol-master`)을 입력합니다.
3. Google 애널리틱스는 필요에 따라 선택 후 생성을 완료합니다.

### Step 2: Firestore Database 활성화
1. 좌측 메뉴에서 **빌드** > **Firestore Database**로 이동합니다.
2. **데이터베이스 만들기**를 클릭하고 데이터베이스 위치(예: `asia-northeast3` 서울 또는 기본값)를 선택합니다.
3. 보안 규칙은 **테스트 모드로 시작**을 선택하거나 위 **3. Firestore Security Rules**를 적용합니다.

### Step 3: 익명 인증(Anonymous Auth) 활성화
1. 좌측 메뉴에서 **빌드** > **Authentication**으로 이동합니다.
2. **시작하기** 클릭 후 **로그인 방법** 탭에서 **익명(Anonymous)**을 찾아 **사용 설정** 후 저장합니다.

### Step 4: 웹 앱 등록 및 환경변수 확인
1. 프로젝트 개요 페이지 중앙의 **웹(</>) 아이콘**을 클릭합니다.
2. 앱 닉네임을 입력하고 **앱 등록**을 누릅니다.
3. 화면에 표시되는 `firebaseConfig` 객체 값을 복사합니다.

---

## 🔑 5. 환경변수 설정 (`.env.local`)

프로젝트 루트에 `.env.local` 파일을 생성하고 발급받은 Firebase 키를 입력합니다:

```bash
# .env.local 샘플
VITE_FIREBASE_API_KEY="AIzaSyAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VITE_FIREBASE_AUTH_DOMAIN="your-app-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef12345678"
```

> 💡 **참고**: 환경변수를 설정하지 않아도 브라우저 LocalStorage를 활용한 **로컬 데모 모드**로 안전하게 동작하므로 바로 수업을 진행할 수 있습니다.

---

## 🚀 6. 로컬 실행 및 Vercel 배포 방법

### 로컬 실행 방법
```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 3. 브라우저에서 http://localhost:3000 접속
```

### Vercel 배포 가이드 (Step-by-Step)
1. 코드를 GitHub 저장소에 Push합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: 음표 & 쉼표 마스터 교육 웹앱"
   git branch -M main
   git remote add origin https://github.com/당신의계정/음표-쉼표-마스터.git
   git push -u origin main
   ```
2. [Vercel](https://vercel.com)에 로그인하고 **Add New...** > **Project**를 선택합니다.
3. 생성한 GitHub 저장소를 선택(Import)합니다.
4. **Environment Variables** 항목에 상기 `.env.local`의 `VITE_FIREBASE_*` 키들을 등록합니다.
5. **Deploy** 버튼을 누르면 1~2분 내에 전 세계 어디서나 접속 가능한 HTTPS 웹사이트 주소가 생성됩니다!

---

## 🏫 7. 교사용 수업 활용 가이드 (Classroom Tip)

1. **대형 전자칠판 / 프로젝터 시연**:
   - `도감` 메뉴를 열어 2분쉼표와 온쉼표의 생김새 차이를 함께 관찰하고 소리를 들려줍니다.
2. **모둠별 경쟁 퀴즈**:
   - 각 모둠 태블릿 또는 스마트폰에서 모둠명(예: `1모둠 피아노`, `2모둠 드럼`)을 적고 종합 모험(10문제)에 도전합니다.
3. **실시간 랭킹 확인**:
   - 교사용 화면에서 `🏆 실시간 기록`을 띄워두면 실시간으로 점수가 업데이트되어 학생들의 몰입도가 극대화됩니다.
4. **성적 및 수업 기록**:
   - 수업 종료 후 우측 상단 `선생님 (비밀번호: 1234)` 모달에서 **CSV 다운로드**를 클릭하여 학생들의 점수를 엑셀 파일로 보관하고, **기록 전체 초기화**를 눌러 다음 시간 수업을 준비합니다.
