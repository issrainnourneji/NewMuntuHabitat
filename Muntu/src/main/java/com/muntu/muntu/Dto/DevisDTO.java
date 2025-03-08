package com.muntu.muntu.Dto;

import com.muntu.muntu.Enums.Standing;
import com.muntu.muntu.Enums.TypeSimulation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DevisDTO {
    private Long userId;
    private Long agentId;
    private List<PrestationDetailsDTO> prestations;
    private Double sousTotal; // Pour inclure le sous-total dans la réponse
    private Double taxe;      // Pour inclure la taxe dans la réponse
    private Double totalTTC;
    private String objet;
    private String adresse;
    private Standing standing;
    private TypeSimulation type;
    private LocalDate dateDebut; // Champ pour la date de début
    private Integer duree;

}
