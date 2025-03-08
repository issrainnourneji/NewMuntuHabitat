package com.muntu.muntu.Entity.Document;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.muntu.muntu.Entity.Paiement;
import com.muntu.muntu.Entity.Prestation.FacturePrestation;
import com.muntu.muntu.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "factures")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    @JsonIgnore
    private User agent;

    @Column(name = "is_signed", nullable = false)
    private boolean isSigned = false;

    @Column(name = "sous_total", nullable = false)
    private Double sousTotal = 0.0;

    @Column(name = "taxe", nullable = false)
    private Double taxe = 0.0;

    @Column(name = "total_ttc", nullable = false)
    private Double totalTTC = 0.0;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "facturePrestations"})
    private List<FacturePrestation> facturePrestations = new ArrayList<>();

    public void addPrestation(Prestation prestation, Integer quantite, Double montantTotal) {
        FacturePrestation facturePrestation = new FacturePrestation();
        facturePrestation.setFacture(this);
        facturePrestation.setPrestation(prestation);
        facturePrestation.setQuantite(quantite);
        facturePrestation.setMontantTotal(montantTotal);
        facturePrestations.add(facturePrestation);
    }

    public void calculerTaxeEtTotalTTC(double tauxTaxe) {
        this.taxe = this.sousTotal * tauxTaxe / 100;
        this.totalTTC = this.sousTotal + this.taxe;
    }
}