package com.example.backend.repository;

import com.example.backend.entity.ClickEvent;
import com.example.backend.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    List<ClickEvent> findByUrl(Url url);
    long countByUrl(Url url);
}