# 아무생각

순간순간 하고 있는 일, 떠오르는 생각, 듣고 있는 노래 같은 걸 아무렇게나 적어두는 게시판 사이트. 로그인 없이 누구나 글을 올리고, 댓글을 달고, 공감을 남길 수 있다. 전체 기획은 [`PRD.md`](./PRD.md) 참고.

## 기술 스택

프론트엔드와 백엔드가 완전히 분리되어 있다.

- **프론트엔드**: 순수 HTML/CSS/바닐라 JS (`public/`) — 프레임워크 없음, `fetch`로 API 직접 호출
- **백엔드**: Next.js 16 API 라우트 (`app/api/**`, App Router route handlers)만 남아 있고, 페이지 렌더링용 React 코드는 없다
- **better-sqlite3** — 파일 기반 SQLite, 별도 DB 서버 없음
- 폰트: `OneStoreMobilePop`(로고/제목), `OneStoreMobileGothicBody`(본문) — 눈누(noonnu) 무료 폰트, jsDelivr CDN에서 `@font-face`로 로드 (`public/styles.css`)

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속. 첫 실행 시 `data/app.db` SQLite 파일이 자동 생성된다 (`lib/db.ts`). 이 파일은 `.gitignore`에 포함되어 있어 저장소에는 없다 — 로컬에서 새로 시작하면 빈 게시판으로 뜬다.

루트 `/`는 `next.config.ts`의 `rewrites()`로 `public/index.html`에 매핑되어 있다 (Next.js가 `public/index.html`을 `/`에서 자동으로 서빙해주지 않기 때문). `write.html`, `post.html`은 파일명 그대로 접근한다.

## 기능

- **홈 (`/` → `public/index.html`)**: 소개 문구 + 게시판 목록 (`fetch('/api/posts')`로 채움)
- **글쓰기 (`/write.html`)**: 제목, 내용, 작성자 이름·이메일 입력 폼
- **글 상세 (`/post.html?id=`)**: 본문, 공감 버튼 5종(❤️😄😢👍👎), 댓글 목록 + 댓글 작성
- **댓글**: 이름·이메일·내용 입력, 로그인 없이 누구나 작성 (게시글과 동일한 방식)

### 의도적으로 안 만든 것

로그인/회원가입, 관리자 페이지, 알림 기능 — `PRD.md`의 "안 만드는 것" 항목 참고.

## 프로젝트 구조

```
app/
  api/posts/route.ts                  GET(목록)/POST(작성)
  api/posts/[id]/route.ts             GET(단건 조회)
  api/posts/[id]/reactions/route.ts   POST(공감 카운트 증가)
  api/posts/[id]/comments/route.ts    GET(댓글 목록)/POST(댓글 작성)
lib/
  db.ts                        SQLite 연결 + 스키마(posts, comments) 생성
  types.ts                     Post/Comment/Reaction 타입
public/
  index.html, index.js          홈 (소개 + 게시판 목록)
  write.html, write.js          글쓰기 폼
  post.html, post.js            글 상세 + 공감 + 댓글
  app.js                        공통: 헤더/푸터/콜라주 배경 렌더링, 이모지 매핑, 날짜 포맷, HTML 이스케이프
  styles.css                    전역 스타일 (폰트, 콜라주 배경, 레이아웃, 폼/버튼)
  images/collage/                배경 콜라주용 스텐실 거리 예술 사진 9장 (출처: CREDITS.md)
```

**주의**: `public/*.js`에서 사용자 입력(제목, 본문, 댓글, 이름)을 `innerHTML`로 그릴 때는 반드시 `app.js`의 `escapeHtml()`을 거칠 것 — 안 그러면 저장형 XSS가 된다 (React를 걷어내면서 자동 이스케이프도 같이 없어졌다).

## 데이터 모델

**posts**: `id, title, content, author_name, author_email, created_at, heart, joy, sad, thumbs_up, thumbs_down`
공감 카운트는 로그인이 없어서 누가 눌렀는지 구분하지 않고 그냥 컬럼 값을 1씩 증가시키는 방식이다 (중복 클릭 방지 없음).

**comments**: `id, post_id(FK → posts.id, ON DELETE CASCADE), author_name, author_email, content, created_at`

## 배경 콜라주 이미지

`public/images/collage/`의 사진 9장은 전부 Unsplash(Unsplash License, 무료/출처 표기 불필요)에서 가져온 스텐실 거리 예술 사진이며, 실제 뱅크시(Banksy) 원작 사진이 아니다 — 저작권 문제를 피하기 위해 뱅크시 특유의 무드(모노톤 스텐실, 붉은 포인트)만 가져온 다른 작가들의 사진으로 골랐다. 출처는 같은 폴더의 `CREDITS.md`에 있다.

## 배포

Vercel(`kora10/my-site`)에 GitHub 연동으로 배포되어 있고 `master` push마다 자동 배포된다. Vercel 서버리스 환경은 `/tmp` 외 파일시스템이 읽기 전용이라 `lib/db.ts`는 `process.env.VERCEL`일 때 `/tmp`를 DB 경로로 쓴다 — 다만 `/tmp`는 배포/콜드스타트마다 초기화되므로 **글이 영구 저장되지 않는다**. 데이터를 실제로 유지하려면 Turso/LiteFS 같은 관리형 SQLite나 Postgres 등으로 `lib/db.ts`를 교체해야 한다.

## 알려진 제약

- 글/댓글 삭제·수정 기능 없음 (관리자 없음 정책과 일치)
- 공감 버튼 중복 클릭 방지 없음 (로그인이 없어 사용자 식별 불가)
- 페이지네이션 없음 — 게시글이 많아지면 홈 목록 쿼리에 `LIMIT`/커서 페이지네이션 추가 필요
- Vercel 배포본은 위에서 설명한 대로 데이터가 영구 저장되지 않음
