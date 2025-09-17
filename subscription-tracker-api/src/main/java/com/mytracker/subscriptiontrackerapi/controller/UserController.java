package com.mytracker.subscriptiontrackerapi.controller;

import com.mytracker.subscriptiontrackerapi.model.User;
import com.mytracker.subscriptiontrackerapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * DTO for budget requests/responses
 */
class BudgetRequest {
    private BigDecimal budget;

    public BudgetRequest() {}

    public BudgetRequest(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Save or update the logged-in user's monthly budget.
     */
    @PostMapping("/budget")
    public ResponseEntity<BudgetRequest> updateBudget(@RequestBody BudgetRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMonthlyBudget(request.getBudget());
        userRepository.save(user);

        return ResponseEntity.ok(new BudgetRequest(user.getMonthlyBudget()));
    }

    /**
     * Get the logged-in user's saved monthly budget.
     */
    @GetMapping("/budget")
    public ResponseEntity<BudgetRequest> getBudget() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal budget = user.getMonthlyBudget() != null ? user.getMonthlyBudget() : BigDecimal.ZERO;
        return ResponseEntity.ok(new BudgetRequest(budget));
    }
}
