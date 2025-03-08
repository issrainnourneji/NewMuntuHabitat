package com.muntu.muntu.Entity.Document;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.muntu.muntu.Enums.Lot;
import com.muntu.muntu.Enums.Unite;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class Prestation {

    @Id
    @GeneratedValue
    private Long id;
    private String designation;
    @Enumerated(EnumType.STRING)
    private Lot lot;
    private Double prixFourniture = 0.0;
    private Double prixUnitaire = 0.0;
    @Enumerated(EnumType.STRING)
    private Unite unite;


}

