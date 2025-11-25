# Coin Simulator Backend (Spring Boot)

본 백엔드는 코인 시뮬레이터 프로젝트의 서버 확장 버전으로,  
차트 데이터 제공 및 매수·매도 로직을 API 형태로 제공하는 것을 목표로 합니다.

---

## 📌 기술 스택

- Spring Boot 3.x
- Java 17
- Gradle
- (Optional) JPA 추가 가능

---

## 📁 패키지 구조

```bash
com.wondongin.coinsimulator
├── controller/
│ ├── ChartController.java
│ ├── TradeController.java
│ └── PortfolioController.java
├── service/
├── domain/
├── repository/
└── dto/
```

---

## 📡 API 예시

### 🎯 GET /api/chart/price

현재 코인 가격 반환

### 🎯 POST /api/trade/buy

매수 요청

### 🎯 POST /api/trade/sell

매도 요청

---

## 🚀 실행 방법

```bash
cd server/springboot
./gradlew bootRun
```
