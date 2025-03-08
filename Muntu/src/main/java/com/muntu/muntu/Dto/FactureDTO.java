package com.muntu.muntu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureDTO {
    private Long userId;
    private Long agentId;
    private List<PrestationDetailsDTO> prestations;
    private Double sousTotal; // Pour inclure le sous-total dans la réponse
    private Double taxe;      // Pour inclure la taxe dans la réponse
    private Double totalTTC;
}