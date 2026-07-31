# 아무생각

순간순간 하고 있는 일, 떠오르는 생각, 듣고 있는 노래 같은 걸 아무렇게나 적어두는 게시판 사이트. 로그인 없이 누구나 글을 올리고, 댓글을 달고, 공감을 남길 수 있다. 전체 기획은 [`PRD.md`](./PRD.md) 참고.

## 기술 스택

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **better-sqlite3** — 파일 기반 SQLite, 별도 DB 서버 없음
- 폰트: `OneStoreMobilePop`(로고/제목), `OneStoreMobileGothicBody`(본문) — 눈누(noonnu) 무료 폰트, jsDelivr CDN에서 `@font-face`로 로드 (`app/globals.css`)

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속. 첫 실행 시 `data/app.db` SQLite 파일이 자동 생성된다 (`lib/db.ts`). 이 파일은 `.gitignore`에 포함되어 있어 저장소에는 없다 — 로컬에서 새로 시작하면 빈 게시판으로 뜬다.

## 기능

- **홈 (`/`)**: 소개 문구 + 게시판 목록 (한 페이지에 병합됨)
- **글쓰기 (`/board/new`)**: 제목, 내용, 작성자 이름·이메일 입력
- **글 상세 (`/board/[id]`)**: 본문, 공감 버튼 5종(❤️😄😢👍👎), 댓글 목록 + 댓글 작성
- **댓글**: 이름·이메일·내용 입력, 로그인 없이 누구나 작성 (게시글과 동일한 방식)

### 의도적으로 안 만든 것

로그인/회원가입, 관리자 페이지, 알림 기능 — `PRD.md`의 "안 만드는 것" 항목 참고.

## 프로젝트 구조

```
app/
  page.tsx                     소개 + 게시판 목록 (홈)
  board/new/page.tsx           글쓰기 폼 (client component)
  board/[id]/page.tsx          글 상세 + 댓글 (server component)
  board/page.tsx               /board → / 로 리다이렉트 (구 URL 호환용)
  api/posts/route.ts           GET(목록)/POST(작성)
  api/posts/[id]/route.ts      GET(단건 조회)
  api/posts/[id]/reactions/route.ts   POST(공감 카운트 증가)
  api/posts/[id]/comments/route.ts    POST(댓글 작성)
  layout.tsx                   전역 레이아웃, 헤더/푸터, 콜라주 배경
  globals.css                  @font-face, 콜라주 배경 CSS
components/
  ReactionButtons.tsx           공감 버튼 (client component)
  CommentForm.tsx                댓글 작성 폼 (client component)
lib/
  db.ts                        SQLite 연결 + 스키마(posts, comments) 생성
  types.ts                     Post/Comment/Reaction 타입 (client에서도 import 가능하도록 db.ts와 분리)
  reactions.ts                  공감 이모지 매핑, 날짜 포맷 유틸
public/images/collage/          배경 콜라주용 스텐실 거리 예술 사진 9장 (출처: CREDITS.md)
```

**주의**: `lib/types.ts`는 `lib/db.ts`(better-sqlite3, fs 사용)와 분리되어 있다. 클라이언트 컴포넌트(`ReactionButtons`, `CommentForm`)에서 타입/상수가 필요하면 반드시 `lib/db.ts`가 아니라 `lib/types.ts`에서 import할 것 — 안 그러면 서버 전용 모듈이 브라우저 번들에 딸려 들어가 빌드가 깨진다 (실제로 한 번 겪은 버그).

## 데이터 모델

**posts**: `id, title, content, author_name, author_email, created_at, heart, joy, sad, thumbs_up, thumbs_down`
공감 카운트는 로그인이 없어서 누가 눌렀는지 구분하지 않고 그냥 컬럼 값을 1씩 증가시키는 방식이다 (중복 클릭 방지 없음).

**comments**: `id, post_id(FK → posts.id, ON DELETE CASCADE), author_name, author_email, content, created_at`

## 배경 콜라주 이미지

`public/images/collage/`의 사진 9장은 전부 Unsplash(Unsplash License, 무료/출처 표기 불필요)에서 가져온 스텐실 거리 예술 사진이며, 실제 뱅크시(Banksy) 원작 사진이 아니다 — 저작권 문제를 피하기 위해 뱅크시 특유의 무드(모노톤 스텐실, 붉은 포인트)만 가져온 다른 작가들의 사진으로 골랐다. 출처는 같은 폴더의 `CREDITS.md`에 있다.

## 배포 관련 참고사항

현재는 로컬 실행만 검증된 상태이고 배포는 안 되어 있다. Vercel처럼 파일시스템이 휘발성인 서버리스 환경에 그대로 배포하면 `data/app.db`가 배포마다 초기화된다 — 배포하려면 Turso/LiteFS 같은 관리형 SQLite나 Postgres 등으로 `lib/db.ts`를 교체해야 한다.

## 알려진 제약

- 글/댓글 삭제·수정 기능 없음 (관리자 없음 정책과 일치)
- 공감 버튼 중복 클릭 방지 없음 (로그인이 없어 사용자 식별 불가)
- 페이지네이션 없음 — 게시글이 많아지면 홈 목록 쿼리에 `LIMIT`/커서 페이지네이션 추가 필요
