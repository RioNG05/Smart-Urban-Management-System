package com.example.backend.Repository;

import com.example.backend.Entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("""
    SELECT COUNT(a) > 0 FROM Appointment a
    WHERE a.assignedTo.id = :staffId
    AND a.meetingDate = :date
    AND (
        a.startTime < :endTime AND a.endTime > :startTime
    )
""")
    boolean existsConflict(
            @Param("staffId") Integer staffId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
    @Query("""
    SELECT COUNT(a) > 0 FROM Appointment a
    WHERE a.assignedTo.id = :staffId
    AND a.id <> :appointmentId
    AND a.meetingDate = :date
    AND (
        a.startTime < :endTime AND a.endTime > :startTime
    )
""")
    boolean existsConflictExcludeId(
            @Param("staffId") Integer staffId,
            @Param("appointmentId") Integer appointmentId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}