package com.example.backend.Service;

import com.example.backend.DTO.Request.ReplyCreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Complaint;
import com.example.backend.Entity.Reply;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.ComplaintRepository;
import com.example.backend.Repository.ReplyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final ComplaintRepository complaintRepository;
    private final AccountRepository accountRepository;

    public ReplyService(ReplyRepository replyRepository,
                        ComplaintRepository complaintRepository,
                        AccountRepository accountRepository) {
        this.replyRepository = replyRepository;
        this.complaintRepository = complaintRepository;
        this.accountRepository = accountRepository;
    }

    public List<Reply> findAll() {
        return replyRepository.findAll();
    }

    public Reply findById(Integer id) {
        return replyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reply not found"));
    }

    public Reply create(ReplyCreateRequest request) {

        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reply reply = new Reply();
        reply.setContent(request.getContent());
        reply.setComplaint(complaint);
        reply.setRepliedByUser(user);

        return replyRepository.save(reply);
    }

    public Reply update(Integer id, ReplyCreateRequest request) {

        Reply reply = findById(id);

        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        reply.setContent(request.getContent());
        reply.setComplaint(complaint);
        reply.setRepliedByUser(user);

        return replyRepository.save(reply);
    }

    public void delete(Integer id) {
        replyRepository.deleteById(id);
    }

    public List<Reply> findByComplaint(Integer complaintId) {
        return replyRepository.findByComplaintId(complaintId);
    }
}