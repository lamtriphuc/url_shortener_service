package com.example.backend.controller;

import com.example.backend.entity.Url;
import com.example.backend.service.ClickEventService;
import com.example.backend.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class RedirectController {

    private final UrlService urlService;
    private final ClickEventService clickEventService;

    public RedirectController(UrlService urlService, ClickEventService clickEventService) {
        this.urlService = urlService;
        this.clickEventService = clickEventService;
    }

    @GetMapping("/s/{shortAlias}")
    public ResponseEntity<Void> redirect(@PathVariable String shortAlias) {
        Url url = urlService.getUrlByAlias(shortAlias);

        // Pass only the URL ID to async method to avoid detached entity issues
        clickEventService.recordClick(url.getId());

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url.getOriginalUrl()))
                .build();
    }
}