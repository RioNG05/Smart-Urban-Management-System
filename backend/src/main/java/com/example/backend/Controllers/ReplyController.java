package com.example.backend.Controllers;

import com.example.backend.DTO.Request.reply.ReplyCreateRequest;
import com.example.backend.Entity.Reply;
import com.example.backend.Service.ReplyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {

    private final ReplyService service;

    public ReplyController(ReplyService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reply> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Reply getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public Reply create(@Valid @RequestBody ReplyCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Reply update(@PathVariable Integer id,
                        @Valid @RequestBody ReplyCreateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/complaint/{complaintId}")
    public List<Reply> getByComplaint(@PathVariable Integer complaintId) {
        return service.findByComplaint(complaintId);
    }
}