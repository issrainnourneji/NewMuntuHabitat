package com.muntu.muntu.Services.Impl;
import com.muntu.muntu.Dto.ReclamationRequest;
import com.muntu.muntu.Dto.Response;
import com.muntu.muntu.Entity.Chat.Reclamation;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.ReclamationStatus;
import com.muntu.muntu.Enums.UserRole;
import com.muntu.muntu.Repository.Chat.ReclamationRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReclamationServiceImpl {
    private final ReclamationRepository reclamationRepository;
    private final UserRepository userRepository;

    public Reclamation createReclamation(String objet, String description) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> currentUserOpt = userRepository.findByEmail(email);

        if (!currentUserOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User currentUser = currentUserOpt.get();

        if (currentUser.getRole() != UserRole.USER) {
            throw new RuntimeException("Only users can create reclamations");
        }
        User assignedAgent = currentUser.getAgent();
        if (assignedAgent == null) {
            throw new RuntimeException("No agent assigned to the user");
        }
        Reclamation reclamation = Reclamation.builder()
                .objet(objet)
                .description(description)
                .date(LocalDateTime.now())
                .user(currentUser)
                .agent(assignedAgent)
                .status(ReclamationStatus.PENDING)
                .build();

        return reclamationRepository.save(reclamation);
    }

    public ResponseEntity<?> getReclamations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> currentUserOpt = userRepository.findByEmail(email);

            if (!currentUserOpt.isPresent()) {
                throw new RuntimeException("User not found");
            }

            User currentUser = currentUserOpt.get();
            List<Reclamation> reclamations;

            // Vérifier le rôle de l'utilisateur et obtenir les réclamations correspondantes
            if (currentUser.getRole() == UserRole.AGENT) {
                reclamations = reclamationRepository.findByAgent(currentUser);
            } else if (currentUser.getRole() == UserRole.USER) {
                reclamations = reclamationRepository.findByUser(currentUser);
            } else {
                throw new RuntimeException("Invalid role");
            }

            // Construire la réponse
            List<Map<String, Object>> responseList = new ArrayList<>();
            for (Reclamation reclamation : reclamations) {
                Map<String, Object> reclamationData = new HashMap<>();
                reclamationData.put("id", reclamation.getId());
                reclamationData.put("email", reclamation.getUser().getEmail());
                reclamationData.put("objet", reclamation.getObjet());
                reclamationData.put("description", reclamation.getDescription());
                reclamationData.put("date", reclamation.getDate());
                reclamationData.put("reponse", reclamation.getReponse());
                reclamationData.put("status", reclamation.getStatus());

                // Si l'utilisateur est un agent, ajouter l'ID du client
                if (currentUser.getRole() == UserRole.AGENT) {
                    reclamationData.put("clientId", reclamation.getUser() != null ? reclamation.getUser().getId() : null);
                }

                responseList.add(reclamationData);
            }

            // Retourner les réclamations avec ou sans l'ID du client selon le rôle
            return ResponseEntity.ok(responseList);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    public Response respondToReclamation(Long reclamationId, String responseText) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Optional<User> agentOpt = userRepository.findByEmail(email);
        if (!agentOpt.isPresent() || agentOpt.get().getRole() != UserRole.AGENT) {
            return Response.builder()
                    .status(HttpStatus.FORBIDDEN.value())
                    .message("Access denied. Only agents can respond to reclamations.")
                    .build();
        }

        User agent = agentOpt.get();

        Optional<Reclamation> reclamationOpt = reclamationRepository.findById(reclamationId);
        if (!reclamationOpt.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Reclamation not found.")
                    .build();
        }

        Reclamation reclamation = reclamationOpt.get();

        // Vérifiez que la réclamation est assignée à cet agent
        if (!reclamation.getAgent().equals(agent)) {
            return Response.builder()
                    .status(HttpStatus.FORBIDDEN.value())
                    .message("You can only respond to reclamations assigned to you.")
                    .build();
        }

        // Ajouter la réponse
        reclamation.setReponse(responseText);
        reclamation.setStatus(ReclamationStatus.RESOLVED);
        reclamationRepository.save(reclamation);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Reclamation responded successfully.")
                .build();
    }

    public boolean updateReclamationResponse(Long reclamationId, String newResponse, String agentEmail) {
        Optional<Reclamation> reclamationOpt = reclamationRepository.findById(reclamationId);

        if (reclamationOpt.isEmpty()) {
            return false; // Réclamation non trouvée
        }

        Reclamation reclamation = reclamationOpt.get();

        // Vérifier si l'agent qui effectue la modification est bien celui affecté à la réclamation
        if (!reclamation.getAgent().getEmail().equals(agentEmail)) {
            return false; // L'agent n'est pas autorisé à modifier cette réclamation
        }

        // Mettre à jour la réponse de la réclamation
        reclamation.setReponse(newResponse);
        reclamation.setStatus(ReclamationStatus.RESOLVED);
        reclamationRepository.save(reclamation);

        return true; // Réponse mise à jour avec succès
    }
    public void DeleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }

    public List<Reclamation> RetrieveAllReclamation() {
        List<Reclamation> reclamations ;
        reclamations = reclamationRepository.findAll();
        return reclamations ;
    }
}
