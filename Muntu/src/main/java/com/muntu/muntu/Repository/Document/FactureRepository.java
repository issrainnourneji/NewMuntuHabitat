package com.muntu.muntu.Repository.Document;


import com.muntu.muntu.Entity.Document.Facture;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FactureRepository extends JpaRepository<Facture,Long> {
    List<Facture> findByUserId(Long userId);
    List<Facture> findByAgent(User agent);

}
