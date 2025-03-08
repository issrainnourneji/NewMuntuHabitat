package com.muntu.muntu.Entity.Prestation;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.muntu.muntu.Entity.Document.Facture;
import com.muntu.muntu.Entity.Document.Prestation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "facture_prestation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacturePrestation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "facture"})

    @JoinColumn(name = "facture_id", nullable = false)
    @JsonIgnore
    private Facture facture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "prestation_id", nullable = false)
    private Prestation prestation;

    private Integer quantite;
    private Double montantTotal;
}