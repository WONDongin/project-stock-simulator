package com.wondongin.coinsimulator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    // 내 포트폴리오 조회
    @GetMapping
    public String getPortfolio() {
        // TODO: Portfolio 데이터 연동 예정
        return "Portfolio information (stub)";
    }
}
