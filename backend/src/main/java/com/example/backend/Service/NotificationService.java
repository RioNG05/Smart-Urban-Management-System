package com.example.backend.Service;

import com.example.backend.DTO.Request.notification.*;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

    public Notification create(NotificationCreateRequest request) {
        return createNotification(
                request.getReceiverId(),
                request.getTargetRole(),
                request.getTitle(),
                request.getMessage(),
                request.getType(),
                request.getRelatedUrl()
        );
    }

    public Notification createNotification(
            Integer receiverId,
            String targetRole,
            String title,
            String message,
            String type,
            String relatedUrl
    ) {
        Account receiver = null;

        if (receiverId != null) {
            receiver = accountRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));
        }

        Notification noti = Notification.builder()
                .receiver(receiver)
                .targetRole(targetRole)
                .title(title)
                .message(message)
                .type(type)
                .relatedUrl(relatedUrl)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(noti);
    }

    public Notification markAsRead(Integer id) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        noti.setIsRead(true);

        return notificationRepository.save(noti);
    }

    public List<Notification> getByUser(Integer userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getByRole(String role) {
        return notificationRepository.findByTargetRole(role);
    }

    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    public void delete(Integer id) {
        notificationRepository.deleteById(id);
    }
    public List<Notification> getUnread(Integer userId) {
        return notificationRepository.findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    public long countUnread(Integer userId) {
        return notificationRepository.countByReceiverIdAndIsReadFalse(userId);
    }
    @Transactional
    public void markAllAsRead(Integer userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
