package com.mytracker.subscriptiontrackerapi.dto;

import java.math.BigDecimal;

public class MonthlyExpenseDTO {
    private String month;
    private BigDecimal totalCost;

    public MonthlyExpenseDTO(String month, BigDecimal totalCost) {
        this.month = month;
        this.totalCost = totalCost;
    }
    
    // Getters
    public String getMonth() { return month; }
    public BigDecimal getTotalCost() { return totalCost; }
}