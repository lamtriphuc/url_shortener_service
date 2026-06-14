package com.example.backend.service;

import com.example.backend.repository.UrlRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class ShortAliasService {

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int BASE = ALPHABET.length();
    private static final int ALIAS_LENGTH = 7;
    private static final int MAX_RETRIES = 10;

    private final SecureRandom random = new SecureRandom();
    private final UrlRepository urlRepository;

    public ShortAliasService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public String generateUniqueAlias() {
        for (int i = 0; i < MAX_RETRIES; i++) {
            String alias = generateRandomAlias();
            if (!urlRepository.existsByShortAlias(alias)) {
                return alias;
            }
        }
        throw new RuntimeException("Unable to generate a unique short alias after " + MAX_RETRIES + " attempts");
    }

    private String generateRandomAlias() {
        StringBuilder sb = new StringBuilder(ALIAS_LENGTH);
        for (int i = 0; i < ALIAS_LENGTH; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(BASE)));
        }
        return sb.toString();
    }
}