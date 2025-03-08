package com.muntu.muntu.Dto;

import com.muntu.muntu.Enums.Lot;
import com.muntu.muntu.Enums.Unite;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrestationDetailsDTO {
    private Long prestationId;
    private Integer quantite;
    private Double montantTotal;
    private String designation;
    private Lot lot;            // Lot de la prestation
    private Double prixUnitaire;
    private Unite unite;

}