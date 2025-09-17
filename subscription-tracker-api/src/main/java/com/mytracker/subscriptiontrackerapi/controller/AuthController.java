package com.mytracker.subscriptiontrackerapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // This endpoint will be protected. Spring will trigger the Google login
    // if an unauthenticated user tries to access it.
    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("loggedIn", false));
        }

        // For now, we are just returning the user's details from Google.
        // In the next step, we will add logic to save the user and issue a JWT.
        Map<String, Object> attributes = principal.getAttributes();
        return ResponseEntity.ok(attributes);
    }
}