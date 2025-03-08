package com.muntu.muntu.Entity.Simulation;

import com.muntu.muntu.Enums.TypeSimulation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name="question")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue
    private Long id;
    private String text;
    @Enumerated(EnumType.STRING)
    private TypeSimulation type;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Categorie> categories;
    private final LocalDateTime createdAt = LocalDateTime.now();

}

