package com.mytracker.subscriptiontrackerapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBudgetAlert(String to, BigDecimal spent, BigDecimal budget) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("⚠️ Budget Alert");
            message.setText("You have spent " + spent + " which exceeds your budget of " + budget);

            mailSender.send(message);
            System.out.println("✅ Budget alert email sent to: " + to + " | Spent: " + spent + " | Budget: " + budget);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
