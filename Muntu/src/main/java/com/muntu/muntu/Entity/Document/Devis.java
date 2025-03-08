package com.muntu.muntu.Entity.Document;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.muntu.muntu.Entity.Prestation.DevisPrestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.Standing;
import com.muntu.muntu.Enums.TypeSimulation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "devis")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Devis {
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

    private String objet;

    private String adresse;

    @Enumerated(EnumType.STRING)
    private Standing standing;

    @Enumerated(EnumType.STRING)
    private TypeSimulation type;
    @Column(name = "date_Debut", nullable = false)
    private LocalDate dateDebut; // Champ pour la date de début

    @Column(name = "duree", nullable = false)
    private Integer duree;

    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "devisPrestations"})
    private List<DevisPrestation> devisPrestations = new ArrayList<>();

    public void addPrestation(Prestation prestation, Integer quantite, Double montantTotal) {
        DevisPrestation devisPrestation = new DevisPrestation();
        devisPrestation.setDevis(this);
        devisPrestation.setPrestation(prestation);
        devisPrestation.setQuantite(quantite);
        devisPrestation.setMontantTotal(montantTotal);
        devisPrestations.add(devisPrestation);
    }

    public void calculerTaxeEtTotalTTC(double tauxTaxe) {
        this.taxe = this.sousTotal * tauxTaxe / 100;
        this.totalTTC = this.sousTotal + this.taxe;
    }

}
