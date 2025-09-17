package com.mytracker.subscriptiontrackerapi.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpcomingBillDTO {
    private String name;
    private BigDecimal cost;
    private LocalDate nextBillingDate;

    public UpcomingBillDTO(String name, BigDecimal cost, LocalDate nextBillingDate) {
        this.name = name;
        this.cost = cost;
        this.nextBillingDate = nextBillingDate;
    }

    // Getters
    public String getName() { return name; }
    public BigDecimal getCost() { return cost; }
    public LocalDate getNextBillingDate() { return nextBillingDate; }
}