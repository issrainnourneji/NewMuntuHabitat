package com.muntu.muntu.Entity.Prestation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.muntu.muntu.Entity.Document.Devis;
import com.muntu.muntu.Entity.Document.Prestation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "devis_prestation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DevisPrestation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "devis"})

    @JoinColumn(name = "devis_id", nullable = false)
    @JsonIgnore
    private Devis devis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "prestation_id", nullable = false)
    private Prestation prestation;

    private Integer quantite;
    private Double montantTotal;
}
