package com.mytracker.subscriptiontrackerapi.controller;

import com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO;
import com.mytracker.subscriptiontrackerapi.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // Use the specific origin from your SecurityConfig
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public String getAnalysis(@RequestBody List<CategoryExpenseDTO> summaryData) {
        return aiService.getExpenseAnalysis(summaryData);
    }
}