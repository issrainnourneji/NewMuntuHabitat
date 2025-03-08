package com.muntu.muntu.Mapper;

import com.muntu.muntu.Services.Impl.AppointmentServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AppointmentScheduler {

    private final AppointmentServiceImpl appointmentService;

    @Scheduled(cron = "0 0 * * * *")
    public void updateStatuses() {
        appointmentService.updateAppointmentStatuses();
    }
}
