# OCIR 설정 가이드

## 1. GitHub Secrets 설정

Private repository의 **Settings > Secrets and variables > Actions**에서 다음 secrets를 추가하세요:

### 필수 Secrets

| Secret Name | Value | 설명 |
|-------------|-------|------|
| `OCIR_ENDPOINT` | `ap-chuncheon-1.ocir.io` | OCIR 엔드포인트 (춘천 리전) |
| `OCIR_USERNAME` | `godcl1623/{your-email}` | OCIR 사용자명 (테넌시/이메일) |
| `OCIR_TOKEN` | `{your-auth-token}` | Oracle Cloud 인증 토큰 |
| `OCIR_REPOSITORY` | `godcl1623/bookmark-curation` | 이미지 저장 경로 |

### OCIR_USERNAME 형식
```
godcl1623/{Oracle Cloud 로그인 이메일}
```

예시: `godcl1623/user@example.com`

### OCIR_TOKEN 생성 방법

1. Oracle Cloud Console 접속
2. 우측 상단 프로필 클릭 > **사용자 설정**
3. 좌측 메뉴 > **인증 토큰**
4. **토큰 생성** 클릭
5. 설명 입력 (예: "GitHub Actions OCIR")
6. **생성된 토큰 복사** (한 번만 표시됨!)
7. GitHub Secrets에 `OCIR_TOKEN`으로 등록

## 2. VPS에 OCIR 인증 설정

VPS에서 OCIR로부터 이미지를 pull하려면 Docker 로그인이 필요합니다:

```bash
# VPS에 SSH 접속 후
docker login ap-chuncheon-1.ocir.io \
  --username godcl1623/{your-email} \
  --password {your-auth-token}
```

또는 `/home/ubuntu/.docker/config.json`에 인증 정보가 저장됩니다.

## 3. docker-compose.yml 수정

VPS의 `/home/ubuntu/compose/docker-compose.yml`에서 이미지 경로를 OCIR로 변경:

```yaml
services:
  backend-dev:
    image: ap-chuncheon-1.ocir.io/godcl1623/bookmark-curation:latest-dev
    # ... 나머지 설정

  backend:
    image: ap-chuncheon-1.ocir.io/godcl1623/bookmark-curation:latest
    # ... 나머지 설정
```

## 4. OCIR Repository 생성

Oracle Cloud Console에서 Container Registry 리포지토리를 생성해야 합니다:

1. **Developer Services** > **Container Registry**
2. **Create Repository** 클릭
3. Repository name: `bookmark-curation`
4. Access: **Private** 선택
5. 생성 완료

## 5. 워크플로우 파일

### Development 배포
- 파일: `.github/workflows/deploy-dev.yml`
- 트리거: `repository_dispatch` (type: `deploy-dev`)
- 브랜치: `develop`
- 이미지 태그:
  - `dev-{commit-sha}`
  - `latest-dev`

### Production 배포
- 파일: `.github/workflows/deploy-prod.yml`
- 트리거: `repository_dispatch` (type: `deploy-prod`)
- 브랜치: `main`
- 이미지 태그:
  - `prod-{commit-sha}`
  - `latest`

## 6. 배포 테스트

### Development 배포 트리거
Public repository의 `develop` 브랜치에 push하면 webhook forwarder가 private repo로 전달하여 자동 배포됩니다.

### Production 배포 트리거
Public repository의 `main` 브랜치에 push하면 자동 배포됩니다.

### 수동 트리거
Private repository의 Actions 탭에서 workflow를 수동으로 실행할 수도 있습니다.

## 7. 설정 상태

- ✅ OCIR Registry 생성 완료
- ✅ GitHub Secrets 설정 완료
- ✅ VPS OCIR 인증 완료
- ✅ PostgreSQL DB 설정 완료 (linkvault_dev, linkvault_prod)
- ✅ docker-compose.yml 배포 준비 완료
