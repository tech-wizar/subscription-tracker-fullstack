package com.mytracker.subscriptiontrackerapi.controller;

import com.mytracker.subscriptiontrackerapi.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String to) {
        try {
            emailService.sendBudgetAlert(to, new BigDecimal("1200.00"), new BigDecimal("1000.00"));
            return ResponseEntity.ok("✅ Test email sent to " + to);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Failed to send email: " + e.getMessage());
        }
    }
}
