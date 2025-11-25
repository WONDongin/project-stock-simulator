package com.wondongin.coinsimulator.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
public class TradeController {

    // 매수 요청
    @PostMapping("/buy")
    public String buy(@RequestParam String symbol, @RequestParam int price) {
        // TODO: 매수 비즈니스 로직 연결 예정
        return "BUY: " + symbol + " / price: " + price;
    }

    // 매도 요청
    @PostMapping("/sell")
    public String sell(@RequestParam String symbol, @RequestParam int price) {
        // TODO: 매도 로직 연결 예정
        return "SELL: " + symbol + " / price: " + price;
    }
}
