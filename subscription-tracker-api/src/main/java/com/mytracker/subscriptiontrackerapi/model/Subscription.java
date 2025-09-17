package com.mytracker.subscriptiontrackerapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal cost;

    // --- MODIFIED FIELD ---
    @Column(name = "billing_cycle", nullable = false)
    @Enumerated(EnumType.STRING) // Store enum as string in DB
    private BillingCycle billingCycle;
    // ----------------------

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Subscription() {
    }

    // --- MODIFIED CONSTRUCTOR ---
    public Subscription(String name, BigDecimal cost, BillingCycle billingCycle, LocalDate startDate, String category) {
        this.name = name;
        this.cost = cost;
        this.billingCycle = billingCycle;
        this.startDate = startDate;
        this.category = category;
    }
    // --------------------------

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    // --- MODIFIED GETTER AND SETTER ---
    public BillingCycle getBillingCycle() { return billingCycle; }
    public void setBillingCycle(BillingCycle billingCycle) { this.billingCycle = billingCycle; }
    // --------------------------------

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @Override
    public String toString() {
        return "ID: " + id + " | Subscription: " + name + " | Category: " + category + " | Cost: $" + cost +
               " | Cycle: " + billingCycle + " | Start Date: " + startDate;
    }
}