package com.example.backend.Repository;

import com.example.backend.Entity.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, Integer> {

    List<BookingService> findByAccountId(Integer accountId);

    List<BookingService> findByServiceResourceId(Integer resourceId);

    List<BookingService> findAllByOrderByBookAtDesc();
}