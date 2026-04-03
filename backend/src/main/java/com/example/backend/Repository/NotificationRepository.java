package com.example.backend.Repository;

import com.example.backend.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);

    List<Notification> findByTargetRole(String role);

    List<Notification> findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(Integer receiverId);

    long countByReceiverIdAndIsReadFalse(Integer receiverId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver.id = :userId")
    void markAllAsRead(@Param("userId") Integer userId);
}
