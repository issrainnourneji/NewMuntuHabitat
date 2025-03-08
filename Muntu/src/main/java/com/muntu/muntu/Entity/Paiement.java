package com.muntu.muntu.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.muntu.muntu.Entity.Document.Facture;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "paiements")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "facture_id", nullable = false)
    private Facture facture;

    private Double montant;
    private LocalDateTime datePaiement;
    private String statutPaiement; // "EN_ATTENTE", "VALIDE", "REFUSE"
    private String methodePaiement;
    private String referenceTransaction;
}