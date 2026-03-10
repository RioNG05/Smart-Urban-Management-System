package com.example.backend.Controllers;

import com.example.backend.Entity.Reply;
import com.example.backend.Repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyRepository replyRepository;

    @GetMapping
    public List<Reply> getReplies() {
        return replyRepository.findAll();
    }
}