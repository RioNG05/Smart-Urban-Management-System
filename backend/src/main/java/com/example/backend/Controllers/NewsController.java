package com.example.backend.Controllers;

import com.example.backend.DTO.Request.News.NewsCreateRequest;
import com.example.backend.DTO.Request.News.NewsUpdateRequest;
import com.example.backend.DTO.Response.NewsResponse;
import com.example.backend.Service.NewsService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService service;

    public NewsController(NewsService service) {
        this.service = service;
    }

    @GetMapping
    public List<NewsResponse> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public NewsResponse getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('News_C_01')")
    public NewsResponse create(@Valid @RequestBody NewsCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('News_U_01')")
    public NewsResponse update(@PathVariable Integer id,
                       @Valid @RequestBody NewsUpdateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('News_D_01')")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
