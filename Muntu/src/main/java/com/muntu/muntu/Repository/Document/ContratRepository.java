package com.muntu.muntu.Repository.Document;

import com.muntu.muntu.Entity.Document.Contrat;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContratRepository extends JpaRepository<Contrat,Long> {
    List<Contrat> findByUserId(Long userId);
    List<Contrat> findByAgent(User agent);


}
