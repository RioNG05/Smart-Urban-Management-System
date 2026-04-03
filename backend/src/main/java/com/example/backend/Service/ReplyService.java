package com.example.backend.Service;

import com.example.backend.DTO.Request.reply.ReplyCreateRequest;
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
    private final NotificationService notificationService;

    public ReplyService(ReplyRepository replyRepository,
                        ComplaintRepository complaintRepository,
                        AccountRepository accountRepository,
                        NotificationService notificationService) {
        this.replyRepository = replyRepository;
        this.complaintRepository = complaintRepository;
        this.accountRepository = accountRepository;
        this.notificationService = notificationService;
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

        Reply savedReply = replyRepository.save(reply);

        createComplaintReplyNotification(complaint, user);

        return savedReply;
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

    private void createComplaintReplyNotification(Complaint complaint, Account repliedByUser) {
        Integer receiverId = complaint.getMadeByUser() != null ? complaint.getMadeByUser().getId() : null;
        Integer actorId = repliedByUser != null ? repliedByUser.getId() : null;

        if (receiverId == null || receiverId.equals(actorId)) {
            return;
        }

        String actorName =
                repliedByUser.getUsername() != null && !repliedByUser.getUsername().isBlank()
                        ? repliedByUser.getUsername()
                        : "Management team";

        notificationService.createNotification(
                receiverId,
                null,
                "Complaint updated",
                actorName + " replied to your complaint. Open Resident Support to read the response.",
                "COMPLAINT_REPLY",
                "/billing"
        );
    }
}
