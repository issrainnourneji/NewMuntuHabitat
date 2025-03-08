package com.muntu.muntu.Dto;

import com.muntu.muntu.Enums.AppointmentStatus;
import com.muntu.muntu.Enums.AppointmentType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;
    private Long clientId;
    private String clientEmail; // L'email du client
    private Long agentId;
    private LocalDateTime appointmentDate;
    private AppointmentType appointmentType;
    private String notes;
    private AppointmentStatus status;

}