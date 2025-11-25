package com.wondongin.coinsimulator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chart")
public class ChartController {

    // 현재 가격 조회 (더미 값)
    @GetMapping("/price")
    public int getCurrentPrice() {
        return 10000; // TODO: 실제 가격 로직 추가 예정
    }

    // 가격 변동(틱) 테스트용 API
    @GetMapping("/tick")
    public String tick() {
        return "Tick updated (stub)"; // TODO: 랜덤 변동률 로직 추가 예정
    }
}
