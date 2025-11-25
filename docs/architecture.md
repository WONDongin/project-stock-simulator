### Architecture Overview (구조도)

코인 시뮬레이터 프로젝트의 전체적인 구조입니다.
<Br>

### 전체 구조

```
/coin-simulator
├── client/ # 프론트엔드 HTML/CSS/JS
├── server/ # Spring Boot 백엔드
└── docs/ # 문서 (API, ERD, 구조도)
```

<Br>

### Client (Frontend)

### 사용 기술

- HTML / CSS
- Vanilla JavaScript
- UI Rendering: ChartRenderer 클래스
- 도메인 로직: Portfolio, StockEngine, GameEngine

### 담당 역할

- UI 차트 표시
- 가격 변동 시각화
- 클릭 이벤트 처리
- 매수/매도 로직 실행
  <Br>

### Server (Backend)

### 사용 기술

- Spring Boot 3.x
- Java 17
- REST API

### 구조

```
controller/
├── ChartController.java
├── TradeController.java
└── PortfolioController.java

service/ # 비즈니스 로직 예정
repository/ # JPA 연동 예정
domain/ # 엔티티 예정
dto/ # 요청/응답 DTO
```

<Br>

### Client ↔ Server 흐름

1. **Client**

   - JS에서 `/api/chart/tick` 호출
   - 새 가격을 받아 차트 갱신
   - 매수/매도 시 `/api/trade/*` 요청 전송

2. **Server**
   - Controller에서 요청 수신
   - Service 계층 처리
   - Response 반환
