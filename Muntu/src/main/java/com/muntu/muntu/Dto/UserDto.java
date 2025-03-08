package com.muntu.muntu.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String password;
    private String address;
    private String role;

    private ProspectSelectionDto prospectSelection;
    private List<ProspectSelectionDetails> assignedProspects;

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.password = user.getPassword();
        this.role = user.getRole().toString();

        ProspectSelection selection = user.getProspectSelection();
        if (selection != null) {
            this.prospectSelection = new ProspectSelectionDto(
                    selection.getRole(),
                    selection.getPropertyType(),
                    selection.getWorkType(),
                    selection.getBudget()
            );
        }

        // Inclure les prospects assignés avec leurs sélections
        if (user.getAssignedProspects() != null) {
            this.assignedProspects = user.getAssignedProspects().stream()
                    .map(prospectSelection -> new ProspectSelectionDetails(
                            prospectSelection.getUser().getId(),
                            prospectSelection.getUser().getName(),
                            prospectSelection.getUser().getEmail(),
                            prospectSelection.getUser().getPhoneNumber(),
                            prospectSelection.getUser().getAddress(),
                            new ProspectSelectionDto(
                                    prospectSelection.getRole(),
                                    prospectSelection.getPropertyType(),
                                    prospectSelection.getWorkType(),
                                    prospectSelection.getBudget()
                            )
                    ))
                    .collect(Collectors.toList());
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProspectSelectionDetails {
        private Long id;
        private String name;
        private String email;
        private String phoneNumber;
        private String address;
        private ProspectSelectionDto prospectSelection;
    }
}