package com.example.backend.service;

import com.example.backend.dto.ShortenUrlRequest;
import com.example.backend.dto.UrlResponse;
import com.example.backend.entity.Url;
import com.example.backend.entity.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.ClickEventRepository;
import com.example.backend.repository.UrlRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final ClickEventRepository clickEventRepository;
    private final ShortAliasService shortAliasService;

    public UrlService(UrlRepository urlRepository, ClickEventRepository clickEventRepository, ShortAliasService shortAliasService) {
        this.urlRepository = urlRepository;
        this.clickEventRepository = clickEventRepository;
        this.shortAliasService = shortAliasService;
    }

    public UrlResponse shortenUrl(ShortenUrlRequest request, User user) {
        String alias;

        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            if (urlRepository.existsByShortAlias(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias '" + request.getCustomAlias() + "' is already taken");
            }
            alias = request.getCustomAlias();
        } else {
            alias = shortAliasService.generateUniqueAlias();
        }

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortAlias(alias)
                .createdAt(LocalDateTime.now())
                .expiresAt(request.getExpiresAt())
                .user(user)
                .build();

        Url savedUrl = urlRepository.save(url);
        return toUrlResponse(savedUrl, 0);
    }

    public UrlResponse shortenUrlGuest(ShortenUrlRequest request) {
        String alias = shortAliasService.generateUniqueAlias();

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .shortAlias(alias)
                .createdAt(LocalDateTime.now())
                .build();

        Url savedUrl = urlRepository.save(url);
        return toUrlResponse(savedUrl, 0);
    }

    public List<UrlResponse> getUserUrls(User user) {
        List<Url> urls = urlRepository.findByUser(user);
        return urls.stream()
                .map(url -> {
                    long clickCount = clickEventRepository.countByUrl(url);
                    return toUrlResponse(url, clickCount);
                })
                .collect(Collectors.toList());
    }

    public Url getUrlByAlias(String shortAlias) {
        Url url = urlRepository.findByShortAlias(shortAlias)
                .orElseThrow(() -> new BadRequestException("Short URL not found: " + shortAlias));

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Short URL has expired");
        }

        return url;
    }

    private UrlResponse toUrlResponse(Url url, long clickCount) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortAlias(url.getShortAlias())
                .shortUrl("/s/" + url.getShortAlias())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .clickCount(clickCount)
                .build();
    }
}