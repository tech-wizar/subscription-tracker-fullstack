package com.mytracker.subscriptiontrackerapi.service;

import com.mytracker.subscriptiontrackerapi.dto.CategoryExpenseDTO;

// ✅ Use the Google Gen AI SDK packages
import com.google.genai.*;
import com.google.genai.types.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String getExpenseAnalysis(List<CategoryExpenseDTO> summaryData) {
        if (summaryData == null || summaryData.isEmpty()) {
            return "No subscription data to analyze. Add a few subscriptions to get started!";
        }

        try {
            // Create the client (Gemini Developer API via API key)
            Client client = Client.builder().apiKey(geminiApiKey).build();

            // Convert DTO list to JSON array string (you can also use Jackson)
            String payloadJson = summaryData.stream()
                    .map(dto -> String.format("{\"category\":\"%s\",\"totalCost\":%.2f}",
                            dto.getCategory(), dto.getTotalCost()))
                    .collect(Collectors.joining(",", "[", "]"));

            String instruction = "You are a friendly financial assistant. Based on the following monthly " +
                    "subscription expenses by category, provide a brief, insightful, and encouraging " +
                    "analysis for the user in 2-3 sentences. Keep the tone positive. Do not use markdown and provide professional tips on moremultidimensional growth";

            // Structured request: instruction (text) + payload (application/json)
            Content content = Content.fromParts(
                    Part.fromText(instruction),
                    Part.fromText(payloadJson));

            // Call Gemini 2.5 Flash
            GenerateContentResponse resp = client.models.generateContent("gemini-2.5-flash", content, null);

            return resp.text();

        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I'm having trouble analyzing your expenses right now.";
        }
    }
}
