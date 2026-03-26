package com.example.backend.Service;

import com.example.backend.DTO.Request.News.NewsCreateRequest;
import com.example.backend.DTO.Request.News.NewsUpdateRequest;
import com.example.backend.DTO.Response.NewsAuthorResponse;
import com.example.backend.DTO.Response.NewsResponse;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.News;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final AccountRepository accountRepository;

    public NewsService(NewsRepository newsRepository,
                       AccountRepository accountRepository) {
        this.newsRepository = newsRepository;
        this.accountRepository = accountRepository;
    }

    public List<NewsResponse> findAll() {
        return newsRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public NewsResponse findById(Integer id) {
        return toResponse(newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found")));
    }

    public NewsResponse create(NewsCreateRequest request) {

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        News news = new News();
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return toResponse(newsRepository.save(news));
    }

    public NewsResponse update(Integer id, NewsCreateRequest request) {

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return toResponse(newsRepository.save(news));
    }

    public void delete(Integer id) {
        newsRepository.deleteById(id);
    }
    public NewsResponse update(Integer id, NewsUpdateRequest request) {

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return toResponse(newsRepository.save(news));
    }

    private NewsResponse toResponse(News news) {
        Account user = news.getCreatedByUser();

        return NewsResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .content(news.getContent())
                .imageUrl(news.getImageUrl())
                .lastUpdate(news.getLastUpdate())
                .createdByUser(user == null ? null : NewsAuthorResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .build();
    }
}
