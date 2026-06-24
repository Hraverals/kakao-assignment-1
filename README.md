# Assignment 3 - Todo 앱 (Next.js + FastAPI)

## 프로젝트 구조

```
kakao-assignment-3/
├── frontend/                    # Next.js (App Router)
│   ├── app/
│   │   ├── api/todos/
│   │   │   └── route.ts         # API Route (백엔드 프록시)
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   ├── page.tsx     # Todo 수정 페이지
│   │   │   │   └── EditTodoForm.tsx
│   │   │   ├── new/
│   │   │   │   ├── page.tsx     # Todo 생성 페이지
│   │   │   │   └── TodoForm.tsx
│   │   │   ├── TodoList.tsx     # Todo 목록 컴포넌트
│   │   │   ├── error.tsx        # 에러 바운더리
│   │   │   ├── loading.tsx      # 로딩 스켈레톤
│   │   │   └── page.tsx         # Todo 메인 (주간뷰 + 필터)
│   │   ├── actions.ts           # Server Actions (CRUD)
│   │   ├── globals.css          # 커스텀 테마 (Tailwind v4)
│   │   ├── layout.tsx
│   │   └── page.tsx             # 루트 페이지
│   ├── .env.local               # BACKEND_URL, NEXT_PUBLIC_API_URL
│   ├── package.json
│   └── tsconfig.json
├── backend/                     # FastAPI + SQLite
│   ├── main.py                  # API 엔드포인트 (CRUD + 날짜 필터링)
│   ├── requirements.txt
│   └── .env.local               # DATABASE_URL
├── .gitignore
└── README.md
```

## 실행 방법

### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

- 프론트엔드: http://localhost:3000/todos
- 백엔드 API: http://localhost:8000/todos

---

## 체크리스트

### 기능 구현

| 체크사항 | 구현한 내용 |
|---------|-----------|
| 필수 기능이 모두 구현되어 있다 | Todo CRUD(생성, 조회, 수정, 삭제) 전체 구현 완료. `actions.ts`의 Server Action(`createTodo`, `getTodos`, `updateTodo`, `deleteTodo`, `toggleTodo`)이 백엔드 FastAPI를 호출하고, `route.ts`의 API Route가 GET/POST 프록시 역할을 수행한다. 주간뷰 날짜 선택, 필터 탭(전체/진행 중/완료), 완료 토글 기능도 포함. |
| README.md에 구현한 기능에 대한 설명을 작성했다 | 프로젝트 구조, 실행 방법, 기능 설명, 체크리스트를 본 README에 작성했다. |
| 예외 상황에서도 오류 없이 동작한다 | 빈 제목 제출 시 `required` 속성으로 브라우저 단에서 차단되고, Server Action에서도 `if (!title?.trim()) throw new Error`로 이중 검증한다. 존재하지 않는 Todo ID 접근 시 백엔드에서 404를 반환하고, 프론트의 `error.tsx` 에러 바운더리가 "다시 시도" 버튼과 함께 에러 메시지를 표시한다. 삭제 시 `confirm()` 확인 다이얼로그가 뜬다. |
| 새로고침 후에도 데이터가 유지된다 | 데이터는 백엔드 SQLite DB(`todos.db`)에 저장되므로, 새로고침하거나 브라우저를 닫아도 데이터가 유지된다. 주간뷰의 선택 날짜와 필터 상태는 URL의 `searchParams`(`?date=2026-06-24&filter=active`)로 관리되어, 새로고침 시에도 보던 화면이 그대로 유지된다. |

### 코드 품질

| 체크사항 | 구현한 내용 |
|---------|-----------|
| 불필요한 console.log, 주석 처리된 코드가 제거되어 있다 | `error.tsx`의 `console.error(error)`만 에러 디버깅 목적으로 남겨두었고, 그 외 불필요한 로그나 주석 처리된 코드는 없다. |
| 변수명과 함수명이 역할을 명확히 나타낸다 | `getTodos`, `createTodo`, `updateTodo`, `deleteTodo`, `toggleTodo` 등 CRUD 동작을 함수명에 명확히 표현했다. `weekStart`, `dateParam`, `filteredTodos`, `displayYear` 등 변수명도 역할을 직관적으로 나타낸다. |
| 중복 코드가 없고, 반복 로직은 함수로 분리되어 있다 | CRUD 로직은 `actions.ts` 한 곳에 집중되어 있고, 각 페이지에서는 이를 import해서 사용한다. `SubmitButton` 컴포넌트를 `TodoForm.tsx`와 `EditTodoForm.tsx`에서 각각 정의하여 pending 상태 표시를 재사용한다. |
| 들여쓰기와 코드 포맷이 일관되게 유지되어 있다 | 전체 프로젝트에서 2스페이스 들여쓰기, Tailwind 클래스 순서, 함수 선언 스타일이 일관되게 유지되어 있다. |

### UI/UX

| 체크사항 | 구현한 내용 |
|---------|-----------|
| 모든 기능이 UI 상에서 명확하게 인지 가능하다 | 주간뷰 캘린더에서 선택된 날짜는 보라색(`#672be0`) 배경으로 강조되고, 오늘 날짜는 보라색 테두리로 구분된다. 각 요일 아래에 해당 날짜의 Todo 개수가 뱃지로 표시된다. 완료/수정/삭제 버튼이 각각 다른 색상(보라/회색/빨강)으로 구분된다. 필터 탭에서 현재 선택된 필터는 보라색 배경으로 활성 상태를 나타낸다. |
| 빈 상태(데이터 없음)에 대한 화면 처리가 되어 있다 | Todo가 없을 때 "등록된 Todo가 없습니다." 메시지가 표시된다. 로딩 중에는 `loading.tsx`의 스켈레톤 UI가 보여진다. |

### 브라우저 검증

| 체크사항 | 구현한 내용 |
|---------|-----------|
| 크롬 기준 콘솔에 에러가 없다 | `next build` 빌드가 에러 없이 성공하고, 런타임 콘솔 에러 없이 정상 동작한다. |
| 주요 기능을 직접 클릭하며 E2E 흐름을 확인했다 | 주간뷰에서 날짜 선택 → 추가 버튼 → Todo 생성 → 목록 표시 → 완료 토글 → 수정 페이지 이동 → 수정 완료 → 삭제 확인 다이얼로그 → 삭제 완료까지 전체 CRUD 흐름이 프론트-백엔드 간 정상 연동된다. |

### 프로젝트 구조

| 체크사항 | 구현한 내용 |
|---------|-----------|
| 파일과 디렉토리 구조가 정리되어 있다 | Next.js App Router 컨벤션에 따라 `app/todos/page.tsx`(목록), `app/todos/new/page.tsx`(생성), `app/todos/[todoId]/page.tsx`(수정)으로 라우팅 구조를 나누고, Server Action은 `actions.ts`, API Route는 `api/todos/route.ts`에 분리했다. 백엔드는 `backend/main.py` 단일 파일로 구성했다. |
| 불필요한 파일이 포함되어 있지 않다 | `.gitignore`에서 `node_modules/`, `.venv/`, `.next/`, `__pycache__/`, `.env.local`, `todos.db`를 제외 처리했다. |

---

## 환경변수 설정

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000
```

### backend/.env.local

```env
DATABASE_URL=sqlite:///./todos.db
```
