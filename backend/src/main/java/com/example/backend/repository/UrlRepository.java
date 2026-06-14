package com.example.backend.repository;

import com.example.backend.entity.Url;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortAlias(String shortAlias);
    boolean existsByShortAlias(String shortAlias);
    List<Url> findByUser(User user);
}