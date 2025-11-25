/*******************************************
 * Portfolio
 *******************************************/
class Portfolio {
  constructor(seed) {
    this.initialSeed = seed;
    this.seed = seed;
    this.shares = 0;
    this.averagePrice = 0;
  }

  buy(price) {
    const qty = Math.floor(this.seed / price);
    if (qty <= 0) return 0;

    const cost = qty * price;
    this.averagePrice =
      this.shares === 0
        ? price
        : (this.shares * this.averagePrice + qty * price) / (this.shares + qty);

    this.shares += qty;
    this.seed -= cost;
    return qty;
  }

  sell(price) {
    if (this.shares === 0) return 0;
    const revenue = this.shares * price;
    this.seed += revenue;
    this.shares = 0;
    this.averagePrice = 0;
    return revenue;
  }

  getEvaluation(price) {
    return this.shares * price;
  }

  getProfitRate(price) {
    if (this.shares === 0) return 0;
    return ((price - this.averagePrice) / this.averagePrice) * 100;
  }

  getTotalProfit() {
    return this.seed - this.initialSeed;
  }

  reset(seed = 500000) {
    this.initialSeed = seed;
    this.seed = seed;
    this.shares = 0;
    this.averagePrice = 0;
  }

  resetButKeepSeed() {
    this.initialSeed = this.seed;
    this.shares = 0;
    this.averagePrice = 0;
  }

  bankrupt() {
    this.reset(0);
  }
}

/*******************************************
 * StockEngine
 *******************************************/
class StockEngine {
  constructor(initialPrice) {
    this.price = initialPrice;
    this.udFactor = 1;
  }

  updatePrice() {
    const isUp = Math.random() < 0.5;
    const ratePercent = Math.floor(Math.random() * 10) + 1;
    const rate = ratePercent / 100;

    if (isUp) {
      this.price *= 1 + rate;
      this.udFactor *= 1 + rate;
    } else {
      this.price *= 1 - rate;
      this.udFactor *= 1 - rate;
    }

    this.price = Math.round(this.price);

    return {
      price: this.price,
      isUp,
      ratePercent,
      udRatePercent: this.getUdRatePercent(),
    };
  }

  getUdRatePercent() {
    return ((this.udFactor - 1) * 100).toFixed(2);
  }

  reset(initialPrice) {
    this.price = initialPrice;
    this.udFactor = 1;
  }
}

/*******************************************
 * GameEngine
 *******************************************/
class GameEngine {
  constructor(stockEngine, portfolio, maxTurns = 60) {
    this.stockEngine = stockEngine;
    this.portfolio = portfolio;
    this.maxTurns = maxTurns;
    this.turn = 0;
    this.over = false;
  }

  step() {
    if (this.over) return null;

    const tick = this.stockEngine.updatePrice();
    this.turn++;

    const evalPrice = this.portfolio.getEvaluation(this.stockEngine.price);
    const profitRate = this.portfolio.getProfitRate(this.stockEngine.price);

    let autoEvent = null;

    if (evalPrice > 0 && evalPrice < 1) {
      this.portfolio.bankrupt();
      this.over = true;
      autoEvent = "bankrupt";
    } else if (this.turn >= this.maxTurns) {
      this.portfolio.sell(this.stockEngine.price);
      this.over = true;
      autoEvent = "auto-sell";
    }

    return { tick, profitRate, autoEvent };
  }

  reset(maxTurns = 60) {
    this.maxTurns = maxTurns;
    this.turn = 0;
    this.over = false;
  }
}

/*******************************************
 * ChartRenderer (High/Low 캔들)
 *******************************************/
class ChartRenderer {
  constructor(container, canvasHeight) {
    this.container = container;
    this.canvasHeight = canvasHeight;
    this.chartsY = [];
  }

  getLastY(defaultY = 400) {
    if (this.chartsY.length === 0) return defaultY;
    return this.chartsY[this.chartsY.length - 1];
  }

  addCandle(isUp, ratePercent, prevY) {
    const change = ratePercent * 7;
    const noise = (Math.random() - 0.5) * 15;

    let newY = isUp ? prevY - change : prevY + change;
    newY += noise;

    newY = Math.max(50, Math.min(this.canvasHeight - 150, newY));

    const candle = document.createElement("div");
    candle.classList.add("candle");

    const bodyHeight = Math.max(15, Math.abs(ratePercent) * 5);

    const highTail = Math.floor(Math.random() * 20) + 10;
    const lowTail = Math.floor(Math.random() * 20) + 10;

    const wickTop = document.createElement("div");
    wickTop.classList.add("wick-top");
    wickTop.style.height = `${highTail}px`;

    const body = document.createElement("div");
    body.classList.add("candle-body");
    body.style.height = `${bodyHeight}px`;
    body.style.backgroundColor = isUp ? "#ff3131" : "#3f5fff";

    const wickBottom = document.createElement("div");
    wickBottom.classList.add("wick-bottom");
    wickBottom.style.height = `${lowTail}px`;

    candle.appendChild(wickTop);
    candle.appendChild(body);
    candle.appendChild(wickBottom);

    const xNoise = (Math.random() - 0.5) * 10;
    const x = this.chartsY.length * 20 + 40 + xNoise;

    candle.style.transform = `translate(${x}px, ${newY}px)`;

    this.container.appendChild(candle);
    this.chartsY.push(newY);

    return newY;
  }

  reset() {
    this.chartsY = [];
    this.container.querySelectorAll(".candle").forEach((el) => el.remove());
  }

  getCount() {
    return this.chartsY.length;
  }
}

/*******************************************
 * 초기 세팅
 *******************************************/
const INITIAL_SEED = 500000;

const mainEl = document.getElementById("main");
const turnSelect = document.getElementById("turnSelect");
const stockSelect = document.getElementById("stock");

const seedInput = document.getElementById("seed");
const stockPriceInput = document.getElementById("stockPrice");
const udRateInput = document.getElementById("udRate");
const myPriceInput = document.getElementById("myPrice");
const myRateInput = document.getElementById("myRate");

const startBtn = document.getElementById("startBtn");
const buyBtn = document.getElementById("buyBtn");
const sellBtn = document.getElementById("sellBtn");
const resetBtn = document.getElementById("resetBtn");

const popupEl = document.getElementById("popup");
const rankEl = document.getElementById("rank");
const rankImgEl = document.getElementById("rankImage");

const portfolio = new Portfolio(INITIAL_SEED);
const stockEngine = new StockEngine(parseFloat(stockSelect.value));
const gameEngine = new GameEngine(stockEngine, portfolio, 30);
const chartRenderer = new ChartRenderer(mainEl, 800);

let intervalId = null;
let isBankrupt = false;
let isGameRunning = false;

/*******************************************
 * UI 업데이트
 *******************************************/
function formatNumber(num) {
  if (isNaN(num)) return "0";
  return Math.round(num).toLocaleString();
}

function updateAllUI() {
  seedInput.value = formatNumber(portfolio.seed);
  stockPriceInput.value = formatNumber(stockEngine.price);
  udRateInput.value = `${stockEngine.getUdRatePercent()}%`;

  const evalPrice = portfolio.getEvaluation(stockEngine.price);
  myPriceInput.value = formatNumber(evalPrice);

  const rate = portfolio.getProfitRate(stockEngine.price);
  myRateInput.value = `${rate.toFixed(2)}%`;
}

function enableCoinSelector(flag) {
  stockSelect.disabled = !flag;
}

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function hideMainButtons(flag) {
  const display = flag ? "none" : "inline-block";
  startBtn.style.display = display;
  buyBtn.style.display = display;
  sellBtn.style.display = display;
}

/*******************************************
 * 게임 종료 처리
 *******************************************/
function endGame(finalRate) {
  stopInterval();
  isGameRunning = false;
  gameEngine.over = true;

  enableCoinSelector(true);

  const seed = portfolio.seed;
  const profit = portfolio.getTotalProfit();
  const udRateText = stockEngine.getUdRatePercent();

  setTimeout(() => {
    const replay = confirm(
      "거래 종료!\n" +
        "코인 등락률: " +
        udRateText +
        "%\n" +
        "내 수익률: " +
        finalRate.toFixed(2) +
        "%\n" +
        "수익: " +
        formatNumber(profit) +
        "원\n\n" +
        "최종 시드: " +
        formatNumber(seed) +
        "원\n\n" +
        "게임을 다시 하시겠습니까?\n" +
        "취소 : 티어를 확인합니다."
    );

    if (replay) {
      resetGameKeepSeed();
    } else {
      showTierPopup();
    }
  }, 100);
}

function showTierPopup() {
  popupEl.style.display = "flex";

  const seed = portfolio.seed;

  let tier = "";
  let img = "";

  if (seed >= 1000000) {
    tier = "챌린저";
    img = "/client/src/assets/icon_01.png";
    popupEl.style.background =
      "url(/client/src/assets/bk.gif) no-repeat center";
    popupEl.style.backgroundColor = "#fff";
  } else if (seed >= 500000) {
    tier = "마스터";
    img = "/client/src/assets/icon_02.png";
    popupEl.style.background =
      "url(/client/src/assets/bk.gif) no-repeat center";
    popupEl.style.backgroundColor = "#fff";
  } else if (seed >= 300000) {
    tier = "플레티넘";
    img = "/client/src/assets/icon_03.png";
    popupEl.style.background = "#FFF";
  } else {
    tier = "코린이";
    img = "/client/src/assets/icon_05.png";
    popupEl.style.background = "#FFF";
  }

  rankEl.textContent = tier;
  rankImgEl.src = img;

  // 팝업 뜨면 버튼 비활성화
  hideMainButtons(true);
  resetBtn.style.display = "inline-block";
}

function handleBankrupt() {
  isBankrupt = true;
  stopInterval();
  isGameRunning = false;

  enableCoinSelector(true);

  portfolio.bankrupt();
  updateAllUI();

  alert("청산되었습니다.");
}

/*******************************************
 * Reset
 *******************************************/
function resetGame() {
  stopInterval();
  hideMainButtons(false);

  portfolio.reset();
  stockEngine.reset(parseFloat(stockSelect.value));
  gameEngine.reset(60);
  chartRenderer.reset();

  popupEl.style.display = "none";
  isBankrupt = false;
  isGameRunning = false;

  enableCoinSelector(true);
  updateAllUI();
}

function resetGameKeepSeed() {
  stopInterval();
  hideMainButtons(false);

  portfolio.resetButKeepSeed();
  stockEngine.reset(parseFloat(stockSelect.value));
  gameEngine.reset(60);
  chartRenderer.reset();

  popupEl.style.display = "none";
  isBankrupt = false;
  isGameRunning = false;

  enableCoinSelector(true);
  updateAllUI();
}

/*******************************************
 * 버튼 핸들러
 *******************************************/
function startGame() {
  stopInterval();
  isGameRunning = true;
  enableCoinSelector(false);

  const stepCount = parseInt(turnSelect.value); // 1, 10, 30, 60
  let stepCreated = 0;

  // 총 턴수는 항상 60턴
  gameEngine.reset(60);

  let chartY = chartRenderer.getLastY();

  intervalId = setInterval(() => {
    // 1) 이번 batch 종료 조건
    if (stepCreated >= stepCount || gameEngine.over) {
      stopInterval();
      return;
    }

    const summary = gameEngine.step();
    if (!summary) {
      stopInterval();
      return;
    }

    const { tick, profitRate, autoEvent } = summary;

    chartY = chartRenderer.addCandle(tick.isUp, tick.ratePercent, chartY);

    updateAllUI();
    stepCreated++;

    // 2) 전체 게임 종료 조건 (60턴)
    if (gameEngine.turn >= 60) {
      endGame(profitRate);
      return;
    }

    if (autoEvent === "bankrupt") {
      handleBankrupt();
      return;
    }

    if (autoEvent === "auto-sell") {
      endGame(profitRate);
      return;
    }
  }, 100);
}

function buyStock() {
  if (isBankrupt) return alert("청산 상태에서는 매수 불가");
  const price = stockEngine.price;
  if (portfolio.seed < price)
    return alert("시드가 부족하여 매수할 수 없습니다.");
  portfolio.buy(price);
  updateAllUI();

  stockSelect.disabled = true;
}

function sellStock() {
  if (!isGameRunning) return alert("게임을 시작하세요.");
  if (isBankrupt) return;

  const rate = portfolio.getProfitRate(stockEngine.price);
  portfolio.sell(stockEngine.price);

  updateAllUI();
  endGame(rate);
}

function handleStockChange() {
  if (isGameRunning) {
    stockSelect.value = stockEngine.price;
    return alert("게임 중에는 코인 변경 불가");
  }
  stockEngine.reset(parseFloat(stockSelect.value));
  updateAllUI();
}

/*******************************************
 * 이벤트 바인딩
 *******************************************/
stockSelect.addEventListener("change", handleStockChange);
startBtn.addEventListener("click", startGame);
buyBtn.addEventListener("click", buyStock);
sellBtn.addEventListener("click", sellStock);
resetBtn.addEventListener("click", resetGame);

updateAllUI();
