package com.muntu.muntu.Repository;

import com.muntu.muntu.Entity.Appointment;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStatusAndAppointmentDateBefore(AppointmentStatus status, LocalDateTime date);

    List<Appointment> findByClientEmail(String clientEmail);

    List<Appointment> findByAgent(User agent);

}