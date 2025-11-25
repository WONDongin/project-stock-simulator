# **`erd.md`**

(코인 시뮬레이터는 실제 DB 연결 전이므로, “계획된 ERD” 형태로 작성)

```markdown
# ERD (Entity Relationship Diagram)

현재 코인 시뮬레이터 프로젝트는 프론트엔드 중심이지만,  
백엔드 확장을 고려하여 아래와 같은 간단한 ERD를 설계했습니다.

---

## 📌 Portfolio 테이블

| Field         | Type        | Description            |
| ------------- | ----------- | ---------------------- |
| id            | BIGINT (PK) | 유저 포트폴리오 ID     |
| seed          | INT         | 현재 시드(보유한 현금) |
| shares        | INT         | 보유 수량              |
| average_price | INT         | 평단가                 |

---

## 📌 TradeHistory 테이블

| Field        | Type        | Description   |
| ------------ | ----------- | ------------- |
| id           | BIGINT (PK) | 거래 ID       |
| portfolio_id | BIGINT (FK) | 포트폴리오 ID |
| type         | VARCHAR     | BUY or SELL   |
| price        | INT         | 거래 가격     |
| quantity     | INT         | 거래 수량     |
| created_at   | DATETIME    | 거래 시각     |

---

## 📌 ChartTick 테이블

| Field      | Type     | Description  |
| ---------- | -------- | ------------ |
| id         | BIGINT   | PK           |
| price      | INT      | 변동 후 가격 |
| rate       | FLOAT    | 등락률       |
| created_at | DATETIME | 시각         |

---

(TradeHistory, ChartTick 테이블은 향후 기능 확장을 위한 옵션)
```
