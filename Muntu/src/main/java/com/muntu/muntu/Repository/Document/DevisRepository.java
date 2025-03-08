package com.muntu.muntu.Repository.Document;


import com.muntu.muntu.Entity.Document.Devis;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevisRepository extends JpaRepository<Devis,Long> {
    List<Devis> findByUserId(Long userId);
    List<Devis> findByAgent(User agent);

}
