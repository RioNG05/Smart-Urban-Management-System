package com.example.backend.Repository;

import com.example.backend.Entity.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, Integer> {

    List<BookingService> findByAccountId(Integer accountId);

    List<BookingService> findByServiceResourceId(Integer resourceId);

    @Query("""
        select case when count(b) > 0 then true else false end
        from BookingService b
        where b.serviceResource.id = :resourceId
          and b.status in :activeStatuses
          and b.bookFrom < :bookTo
          and b.bookTo > :bookFrom
    """)
    boolean existsOverlappingBooking(@Param("resourceId") Integer resourceId,
                                     @Param("bookFrom") LocalDateTime bookFrom,
                                     @Param("bookTo") LocalDateTime bookTo,
                                     @Param("activeStatuses") List<Integer> activeStatuses);

    @Query("""
        select case when count(b) > 0 then true else false end
        from BookingService b
        where b.serviceResource.id = :resourceId
          and b.id <> :excludeId
          and b.status in :activeStatuses
          and b.bookFrom < :bookTo
          and b.bookTo > :bookFrom
    """)
    boolean existsOverlappingBookingExceptId(@Param("resourceId") Integer resourceId,
                                             @Param("excludeId") Integer excludeId,
                                             @Param("bookFrom") LocalDateTime bookFrom,
                                             @Param("bookTo") LocalDateTime bookTo,
                                             @Param("activeStatuses") List<Integer> activeStatuses);
    List<BookingService> findAllByOrderByBookAtDesc();
}