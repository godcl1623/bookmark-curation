# LinkVault

디바이스 환경에 구애받지 않고 북마크를 저장, 관리하는 서비스입니다.

## 기술 스택

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Monorepo**: npm workspaces

## 프로젝트 구조

```
bookmark-curation/
├── packages/
│   ├── api/          # Express.js 백엔드 서버
│   ├── web/          # React 프론트엔드
│   └── shared/       # 공유 코드
├── prisma/
│   ├── schema.prisma # 데이터베이스 스키마
│   ├── seed.ts       # 시드 데이터
│   ├── init.sql      # PostgreSQL 초기화 스크립트
│   └── migrations/   # 마이그레이션 히스토리
├── docker-compose.yml
└── package.json
```

## 개발환경 세팅

### 필수 요구사항

- Node.js 18 이상
- PostgreSQL 15 (또는 Docker)
- npm 9 이상

### 1. 저장소 클론

```bash
git clone <repository-url>
cd bookmark-curation
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

#### 옵션 A: Docker 사용 (권장)

```bash
# .env 파일 생성
cp .env.example .env
cp packages/api/.env.example packages/api/.env
cp packages/web/.env.example packages/web/.env.development
cp packages/web/.env.example packages/web/.env.production

# 필요시 .env 파일에서 비밀번호 변경

# PostgreSQL 컨테이너 실행
docker compose up

# 데이터베이스 상태 확인
docker compose ps
```

Docker Compose가 자동으로 다음을 수행합니다:

- PostgreSQL 15 설치
- `linkvault` 데이터베이스 생성
- `linkvault_app` 사용자 생성
- `app` 스키마 생성 및 권한 설정
- 컨테이너 자동 재시작 설정 (`restart: unless-stopped`)

만약 로컬에서 실행중인 PostgreSQL과 별도로 Docker 컨테이너 실행을 희망하시는 경우, 다음 두 파일에서 DB에 할당할 포트 번호를 지정해주시기 바랍니다.

- .env
- packages/api/.env

포트 번호 변경이 필요한 키는 다음 2개입니다:

- `DATABASE_URL`
- `DATABASE_PORT`

#### 옵션 B: 로컬 PostgreSQL 사용

1. PostgreSQL 15 설치

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15
sudo systemctl start postgresql
```

2. 데이터베이스 및 사용자 생성

```bash
# PostgreSQL에 접속
psql postgres

# SQL 명령어 실행
CREATE DATABASE linkvault;
CREATE USER linkvault_app WITH PASSWORD 'your_secure_password';

-- linkvault 데이터베이스로 전환
\c linkvault

-- app 스키마 생성
CREATE SCHEMA IF NOT EXISTS app;

-- 권한 설정
ALTER SCHEMA app OWNER TO linkvault_app;
GRANT ALL PRIVILEGES ON DATABASE linkvault TO linkvault_app;
GRANT ALL PRIVILEGES ON SCHEMA app TO linkvault_app;
GRANT ALL PRIVILEGES ON SCHEMA public TO linkvault_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO linkvault_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO linkvault_app;

-- Prisma 마이그레이션을 위한 CREATEDB 권한 (개발환경만)
ALTER USER linkvault_app CREATEDB;

-- 종료
\q
```

3. 환경변수 파일 생성

```bash
cp .env.example .env
cp packages/api/.env.example packages/api/.env
```

`.env` 파일을 열어서 비밀번호를 설정한 값으로 변경하세요.

### 4. Prisma 설정 및 마이그레이션

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행 (데이터베이스 스키마 생성)
npx prisma migrate deploy

# 시드 데이터 추가 (선택사항)
npm run prisma:seed --workspace=@linkvault/api
```

### 5. 개발 서버 실행

```bash
# 터미널 1: API 서버 실행
npm run dev:api

# 터미널 2: 웹 서버 실행
npm run dev:web
```

서버가 실행되면:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## 유용한 명령어

```bash
# 전체 프로젝트 빌드
npm run build

# Lint 실행
npm run lint

# Prisma Studio (데이터베이스 GUI)
npm run prisma:studio --workspace=@linkvault/api

# 새로운 마이그레이션 생성
npx prisma migrate dev --name description_of_changes

# 데이터베이스 초기화 (주의: 모든 데이터 삭제)
npx prisma migrate reset
```

## 데이터베이스 스키마

이 프로젝트는 `public` 스키마 대신 `app` 스키마를 사용합니다. 모든 테이블은 `app` 스키마 내에 생성됩니다.

주요 테이블:

- `users`: 사용자 정보
- `bookmarks`: 북마크 데이터
- `folders`: 폴더 구조
- `tags`: 태그
- `bookmark_tags`: 북마크-태그 관계
- `sessions`: 사용자 세션
- `media`: 북마크 미디어 (이미지 등)

## 트러블슈팅

### 컴퓨터 재시작 후 데이터가 없는 경우

**증상**: Windows/WSL2 재시작 후 데이터베이스는 존재하지만 테이블이 없음

**원인**: Docker Desktop이 컨테이너를 삭제하여 새로 생성됨

**해결**: 이미 `docker-compose.yml`에 `restart: unless-stopped` 설정이 되어 있으므로, 컨테이너가 자동으로 재시작됩니다.

```bash
# 컴퓨터 재시작 후
docker compose up -d  # Docker Desktop이 자동 시작하지 않은 경우만

# 데이터 확인
docker exec linkvault-postgres psql -U linkvault_app -d linkvault -c "SELECT COUNT(*) FROM app.bookmarks;"
```

**주의**: `docker compose down -v` 명령어는 볼륨까지 삭제하므로 **절대 사용하지 마세요**. 컨테이너만 정지하려면 `docker compose stop` 또는
`docker compose down`을 사용하세요.

### Docker 컨테이너 관련

```bash
# 컨테이너 로그 확인
docker compose logs postgres

# 컨테이너 재시작
docker compose restart postgres

# 컨테이너 정지 (데이터 유지)
docker compose stop

# 컨테이너 정지 및 삭제 (데이터 유지)
docker compose down

# ⚠️ 주의: 모든 것을 초기화하고 다시 시작 (데이터 삭제!)
docker compose down -v
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed --workspace=@linkvault/api
```

### Prisma 마이그레이션 오류

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 강제 적용 (개발환경만)
npx prisma db push

# Prisma 클라이언트 재생성
npx prisma generate
```

### 권한 오류

PostgreSQL 사용자가 스키마에 대한 적절한 권한이 있는지 확인하세요:

```sql
-- PostgreSQL에서 확인
\c
linkvault
SELECT schema_name, schema_owner
FROM information_schema.schemata
WHERE schema_name = 'app';
```

`schema_owner`가 `linkvault_app`이어야 합니다.

## 라이선스

Private
