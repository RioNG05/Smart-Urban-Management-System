package com.example.backend.Service;

import com.example.backend.DTO.Request.getintouch.GetInTouchCreateRequest;
import com.example.backend.DTO.Response.GetInTouchResponse;
import com.example.backend.Entity.GetInTouch;
import com.example.backend.Repository.GetInTouchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetInTouchService {

    private final GetInTouchRepository repository;

    // CREATE
    public GetInTouchResponse create(GetInTouchCreateRequest request) {

        GetInTouch entity = new GetInTouch();
        entity.setFullName(request.getFullName());
        entity.setEmail(request.getEmail());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setMessage(request.getMessage());

        GetInTouch saved = repository.save(entity);

        return mapToResponse(saved);
    }

    // GET ALL
    public List<GetInTouchResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY ID
    public GetInTouchResponse getById(Integer id) {
        GetInTouch entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        return mapToResponse(entity);
    }

    // DELETE
    public void delete(Integer id) {
        GetInTouch entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        repository.delete(entity);
    }

    // ================= MAPPER =================
    private GetInTouchResponse mapToResponse(GetInTouch entity) {
        return GetInTouchResponse.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phoneNumber(entity.getPhoneNumber())
                .message(entity.getMessage())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}