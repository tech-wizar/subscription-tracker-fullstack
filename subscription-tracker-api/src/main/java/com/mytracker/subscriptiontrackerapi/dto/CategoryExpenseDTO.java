package com.mytracker.subscriptiontrackerapi.dto;

import java.math.BigDecimal;

// This is a simple data carrier class.
public class CategoryExpenseDTO {
    private String category;
    private BigDecimal totalCost;

    public CategoryExpenseDTO(String category, BigDecimal totalCost) {
        this.category = category;
        this.totalCost = totalCost;
    }

    // Getters
    public String getCategory() { return category; }
    public BigDecimal getTotalCost() { return totalCost; }
}