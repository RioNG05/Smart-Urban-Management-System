package com.example.backend.Service;

import com.example.backend.DTO.Request.News.NewsCreateRequest;
import com.example.backend.DTO.Request.News.NewsUpdateRequest;
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

    public List<News> findAll() {
        return newsRepository.findAll();
    }

    public News findById(Integer id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));
    }

    public News create(NewsCreateRequest request) {

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        News news = new News();
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return newsRepository.save(news);
    }

    public News update(Integer id, NewsCreateRequest request) {

        News news = findById(id);

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return newsRepository.save(news);
    }

    public void delete(Integer id) {
        newsRepository.deleteById(id);
    }
    public News update(Integer id, NewsUpdateRequest request) {

        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setImageUrl(request.getImageUrl());
        news.setCreatedByUser(user);

        return newsRepository.save(news);
    }
}