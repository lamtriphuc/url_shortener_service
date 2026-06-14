package com.example.backend.service;

import com.example.backend.entity.ClickEvent;
import com.example.backend.entity.Url;
import com.example.backend.repository.ClickEventRepository;
import com.example.backend.repository.UrlRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ClickEventService {

    private final ClickEventRepository clickEventRepository;
    private final UrlRepository urlRepository;

    public ClickEventService(ClickEventRepository clickEventRepository, UrlRepository urlRepository) {
        this.clickEventRepository = clickEventRepository;
        this.urlRepository = urlRepository;
    }

    @Async
    @Transactional
    public void recordClick(Long urlId) {
        Url url = urlRepository.findById(urlId).orElse(null);
        if (url == null) {
            return;
        }

        ClickEvent event = ClickEvent.builder()
                .url(url)
                .clickedAt(LocalDateTime.now())
                .build();
        clickEventRepository.save(event);
    }
}