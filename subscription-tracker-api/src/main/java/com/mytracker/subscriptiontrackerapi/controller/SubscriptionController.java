package com.mytracker.subscriptiontrackerapi.controller;

import com.mytracker.subscriptiontrackerapi.model.Subscription;
import com.mytracker.subscriptiontrackerapi.model.User;
import com.mytracker.subscriptiontrackerapi.repository.UserRepository;
import com.mytracker.subscriptiontrackerapi.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO;
import com.mytracker.subscriptiontrackerapi.dto.MonthlyExpenseDTO;
import com.mytracker.subscriptiontrackerapi.dto.UpcomingBillDTO;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // --- MODIFIED ENDPOINT ---
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions(
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "sortDirection", required = false, defaultValue = "DESC") String sortDirection,
            @RequestParam(name = "filterByCycle", required = false) String filterByCycle) {

        List<Subscription> subscriptions = subscriptionService.getAllSubscriptions(sortBy, sortDirection,
                filterByCycle);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription subscription) {
        return subscriptionService.addSubscription(subscription);
    }

    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
    }

    @PutMapping("/{id}")
    public Subscription updateSubscription(@PathVariable Long id, @RequestBody Subscription subscriptionDetails) {
        return subscriptionService.updateSubscription(id, subscriptionDetails);
    }

    @GetMapping("/summary")
    public List<CategoryExpenseDTO> getSubscriptionSummary() {
        return subscriptionService.getExpenseSummary();
    }

    @GetMapping("/upcoming")
    public List<UpcomingBillDTO> getUpcomingBills() {
        return subscriptionService.getUpcomingBills();
    }

    @GetMapping("/monthly-history")
    public List<MonthlyExpenseDTO> getMonthlyHistory() {
        return subscriptionService.getMonthlyExpenseHistory();
    }

    @GetMapping("/budget-status")
    public ResponseEntity<Map<String, Object>> getBudgetStatus() {
        BigDecimal spent = subscriptionService.getCurrentMonthSpending();

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("spent", spent);
        response.put("budget", user.getMonthlyBudget());

        return ResponseEntity.ok(response);
    }

    // ✅ NEW ENDPOINT: manual spending input
    @PostMapping("/spending")
    public ResponseEntity<?> updateSpending(@RequestBody Map<String, BigDecimal> request) {
        BigDecimal spending = request.get("spending");
        subscriptionService.checkBudgetAndSendAlert(spending);
        return ResponseEntity.ok("Spending received: " + spending);
    }

    @GetMapping("/export/monthly-detailed")
    public ResponseEntity<byte[]> exportMonthlyDetailedCSV() {
        String csvContent = subscriptionService.generateMonthlyDetailedCSV();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=monthly_detailed_spending.csv")
                .header("Content-Type", "text/csv")
                .body(csvContent.getBytes());
    }
}
