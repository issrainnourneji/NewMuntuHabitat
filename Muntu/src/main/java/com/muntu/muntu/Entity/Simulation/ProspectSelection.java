package com.muntu.muntu.Entity.Simulation;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.muntu.muntu.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name="prospectSelection")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProspectSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
    private String propertyType;
    private String workType;
    private String budget;

    @JsonManagedReference
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "agent_id")
    private User assignedAgent;



}