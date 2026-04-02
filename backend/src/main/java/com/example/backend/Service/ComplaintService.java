package com.example.backend.Service;

import com.example.backend.DTO.Request.complaint.ComplaintCreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Complaint;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final AccountRepository accountRepository;

    public ComplaintService(ComplaintRepository complaintRepository,
            AccountRepository accountRepository) {
        this.complaintRepository = complaintRepository;
        this.accountRepository = accountRepository;
    }

    public List<Complaint> findAll() {
        return complaintRepository.findAll();
    }

    public Complaint findById(Integer id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public Complaint create(ComplaintCreateRequest request) {

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setContent(request.getContent());
        complaint.setMadeByUser(user);

        return complaintRepository.save(complaint);
    }

    public Complaint update(Integer id, ComplaintCreateRequest request) {

        Complaint complaint = findById(id);

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        complaint.setContent(request.getContent());
        complaint.setMadeByUser(user);

        return complaintRepository.save(complaint);
    }

    public void delete(Integer id) {
        complaintRepository.deleteById(id);
    }
}