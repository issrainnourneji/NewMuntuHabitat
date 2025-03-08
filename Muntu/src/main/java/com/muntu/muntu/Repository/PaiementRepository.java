package com.muntu.muntu.Repository;

import com.muntu.muntu.Entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    Paiement findByFactureId(Long factureId);
}
