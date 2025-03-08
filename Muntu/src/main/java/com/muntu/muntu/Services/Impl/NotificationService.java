package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Entity.Notification;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.NotificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;

    public void envoyerNotification(User agent, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setAgent(agent);

        notificationRepo.save(notification);
    }
}
