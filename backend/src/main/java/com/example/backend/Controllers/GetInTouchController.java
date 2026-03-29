package com.example.backend.Controllers;

import com.example.backend.DTO.Request.getintouch.GetInTouchCreateRequest;
import com.example.backend.DTO.Response.GetInTouchResponse;
import com.example.backend.Service.GetInTouchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/getintouch")
@RequiredArgsConstructor
public class GetInTouchController {

    private final GetInTouchService service;

    // CREATE
    @PostMapping
    public GetInTouchResponse create(@Valid @RequestBody GetInTouchCreateRequest request) {
        return service.create(request);
    }

    // GET ALL
    @GetMapping
    public List<GetInTouchResponse> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public GetInTouchResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}