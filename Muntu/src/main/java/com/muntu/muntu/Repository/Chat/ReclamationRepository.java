package com.muntu.muntu.Repository.Chat;

import com.muntu.muntu.Entity.Chat.Reclamation;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByAgent(User agent); // Réclamations assignées à un agent
    List<Reclamation> findByUser(User user);
}
