### Coin Simulator API Spec

코인 가격 조회, 가격 변동(틱), 매수·매도, 포트폴리오 조회 기능 중심의 간단한 API 명세입니다.
<br><br>

### 1. GET /chart/price (현재 코인 가격 조회)

Response

```json
{
  "price": 10000
}
```

<Br>

### 2. GET /chart/tick (가격 변동(1틱 생성))

Response

```json
{
  "message": "Tick updated",
  "price": 10230,
  "changeRate": 2.3
}
```

<br>

### 3. POST /trade/buy (코인 매수 API)

Request

```json
{
  "symbol": "GD",
  "price": 10000,
  "quantity": 3
}
```

Response

```json
{
  "status": "success",
  "message": "매수 완료",
  "buyPrice": 10000,
  "quantity": 3
}
```

<Br>

### 4. POST /trade/sell (코인 매도 API)

Request

```json
{
  "symbol": "GD",
  "price": 11000,
  "quantity": 3
}
```

Response

```json
{
  "status": "success",
  "message": "매도 완료",
  "sellPrice": 11000,
  "quantity": 3
}
```

<Br>

### 5. GET /portfolio (현재 포트폴리오 상태 조회)

Response

```json
{
  "seed": 500000,
  "shares": 3,
  "averagePrice": 9500,
  "evaluation": 33000,
  "profitRate": 10.52
}
```

<br>

### 6. POST /portfolio/reset (포트폴리오 초기화 (테스트용))

Request

```json
{
  "seed": 500000
}
```

Response

```json
{
  "status": "success",
  "message": "포트폴리오 초기화 완료"
}
```
