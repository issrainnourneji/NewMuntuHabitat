package com.muntu.muntu.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.muntu.muntu.Entity.Document.Post;
import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Enums.Status;
import com.muntu.muntu.Enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;


import java.security.Principal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="user")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Name is required")

    private String name;
    @Column(unique = true)
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String password;
    @NotBlank(message = "Phone number is required")
    @Size(min = 8,max = 10, message = "Phone should be between 8 and 10 characters")
    private String phoneNumber;
    @NotBlank(message = "Address is required")
    private String address;
    private boolean accountLocked;
    private boolean enabled;
    private final LocalDateTime createdAt = LocalDateTime.now();
    private UserRole role;
    private Status status;

    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    @JsonBackReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ProspectSelection prospectSelection;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts;

    @JsonBackReference
    @OneToMany(mappedBy = "assignedAgent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProspectSelection> assignedProspects;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }


}
