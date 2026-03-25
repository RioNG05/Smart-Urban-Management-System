package com.example.backend.Controllers;

import com.example.backend.DTO.Request.reply.ReplyCreateRequest;
import com.example.backend.Entity.Reply;
import com.example.backend.Service.ReplyService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('Replies_R_01')")
    public List<Reply> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('Replies_R_01') or @accessValidate.canViewReplies(#id, authentication)")
    public Reply getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Replies_C_01')")
    public Reply create(@Valid @RequestBody ReplyCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('Replies_U_01')")
    public Reply update(@PathVariable Integer id,
                        @Valid @RequestBody ReplyCreateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Replies_D_01')")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/complaint/{complaintId}")
    @PreAuthorize("@accessValidate.canViewComplaint(#complaintId, authentication)")
    public List<Reply> getByComplaint(@PathVariable Integer complaintId) {
        return service.findByComplaint(complaintId);
    }
}