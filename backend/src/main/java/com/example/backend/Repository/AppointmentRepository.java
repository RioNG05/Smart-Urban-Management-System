package com.example.backend.Repository;

import com.example.backend.Entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query(value = """
    SELECT COUNT(*) FROM Appointments a
    WHERE a.AssignedTo = :staffId
    AND a.MeetingDate = :date
    AND (
        a.StartTime < CAST(:endTime AS TIME)
        AND a.EndTime > CAST(:startTime AS TIME)
    )
""", nativeQuery = true)
    int countConflict(
            @Param("staffId") Integer staffId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
    @Query(value = """
    SELECT COUNT(*) FROM Appointments a
    WHERE a.AssignedTo = :staffId
    AND a.Id <> :appointmentId
    AND a.MeetingDate = :date
    AND (
        a.StartTime < CAST(:endTime AS TIME)
        AND a.EndTime > CAST(:startTime AS TIME)
    )
""", nativeQuery = true)
    int countConflictExcludeId(
            @Param("staffId") Integer staffId,
            @Param("appointmentId") Integer appointmentId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}