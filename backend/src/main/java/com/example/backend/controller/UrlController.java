package com.example.backend.controller;

import com.example.backend.dto.ShortenUrlRequest;
import com.example.backend.dto.UrlResponse;
import com.example.backend.entity.User;
import com.example.backend.security.SecurityUtil;
import com.example.backend.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;
    private final SecurityUtil securityUtil;

    public UrlController(UrlService urlService, SecurityUtil securityUtil) {
        this.urlService = urlService;
        this.securityUtil = securityUtil;
    }

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> shortenUrl(@Valid @RequestBody ShortenUrlRequest request) {
        if (securityUtil.isAuthenticated()) {
            User user = securityUtil.getCurrentUser();
            return ResponseEntity.status(HttpStatus.CREATED).body(urlService.shortenUrl(request, user));
        } else {
            return ResponseEntity.status(HttpStatus.CREATED).body(urlService.shortenUrlGuest(request));
        }
    }

    @GetMapping("/my-links")
    public ResponseEntity<List<UrlResponse>> getMyLinks() {
        User user = securityUtil.getCurrentUser();
        return ResponseEntity.ok(urlService.getUserUrls(user));
    }
}