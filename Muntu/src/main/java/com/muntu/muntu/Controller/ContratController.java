package com.muntu.muntu.Controller;

import com.muntu.muntu.Entity.Document.Contrat;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Services.Impl.ContratServiceImpl;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contrat")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ContratController {
    private final ContratServiceImpl contractService;
    private final UserServiceImpl userService;


    @PostMapping
    public ResponseEntity<Contrat> createContrat(@RequestParam Long userId) {
        try {
            // Récupérer l'utilisateur actuellement authentifié
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // Utiliser le userDetails pour récupérer l'agent (peut-être une méthode dans le service User)
            User agent = userService.findByEmail(userDetails.getUsername()); // Adapté à votre logique

            if (agent == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Appel au service pour créer le contrat, en passant l'utilisateur et l'agent récupérés
            Contrat contrat = contractService.saveContratForUser(userId, agent);
            return ResponseEntity.ok(contrat);
        } catch (IllegalArgumentException e) {
            // Gérer les exceptions si l'utilisateur n'est pas trouvé
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContratsByUser(@PathVariable Long userId) {
        try {
            // Récupérer les contrats de l'utilisateur
            List<Contrat> contrats = contractService.getContratByUser(userId);
            // Récupérer les détails simplifiés de l'utilisateur
            User user = userService.getUserById(userId);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Extraire uniquement les informations essentielles de l'utilisateur et de l'agent
            Map<String, Object> userDetails = Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhoneNumber(),
                    "address", user.getAddress()
            );

            // Récupérer les informations simplifiées de l'agent (si existant)
            Map<String, Object> agentDetails = null;
            if (user.getAgent() != null) {
                User agent = user.getAgent();
                agentDetails = Map.of(
                        "name", agent.getName(),
                        "email", agent.getEmail(),
                        "phone", agent.getPhoneNumber(),
                        "address", agent.getAddress()
                );
            }

            // Renvoyer les informations de l'utilisateur, des contrats et de l'agent
            return ResponseEntity.ok().body(Map.of(
                    "user", userDetails,
                    "contrats", contrats,
                    "agent", agentDetails
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllContratsForAgent() {
        try {
            // Récupérer les contrats pour l'agent
            List<Contrat> contrats = contractService.getAllContratForAgent();

            if (contrats.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Créer une liste des détails de chaque utilisateur associé à chaque contrat
            List<Map<String, Object>> contractsWithUserDetails = new ArrayList<>();

            for (Contrat contrat : contrats) {
                // Récupérer l'agent associé à ce contrat
                User agent = contrat.getAgent();

                // Extraire uniquement les informations essentielles de l'agent
                Map<String, Object> agentDetails = Map.of(
                        "name", agent.getName(),
                        "email", agent.getEmail(),
                        "phone", agent.getPhoneNumber(),
                        "address", agent.getAddress()
                );

                // Récupérer l'utilisateur associé au contrat
                User user = contrat.getUser();

                // Extraire uniquement les informations essentielles de l'utilisateur
                Map<String, Object> userDetails = Map.of(
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhoneNumber(),
                        "address", user.getAddress()
                );

                // Ajouter les détails de l'utilisateur et de l'agent pour ce contrat
                Map<String, Object> contractDetails = Map.of(
                        "contratId", contrat.getId(),
                        "isSigned", contrat.isSigned(),
                        "user", userDetails,  // Inclure les détails de l'utilisateur
                        "agent", agentDetails  // Inclure les détails de l'agent
                );

                contractsWithUserDetails.add(contractDetails);
            }

            // Retourner la réponse avec tous les contrats et les détails de l'utilisateur et de l'agent
            return ResponseEntity.ok().body(Map.of(
                    "contrats", contractsWithUserDetails  // Nous n'envoyons plus un agent global ici
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }
    @GetMapping("/my-contracts")
    public ResponseEntity<?> getMyContrats() {
        try {
            // Récupérer l'agent actuellement authentifié
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Utilisateur authentifié: " + userDetails.getUsername()); // Log de l'email de l'utilisateur

            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Agent non trouvé");
            }

            // Log de l'agent récupéré
            System.out.println("Agent trouvé: " + agent.getEmail());

            // Récupérer les contrats associés à cet agent
            List<Contrat> contrats = contractService.getContratsByAgent(agent);

            if (contrats.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun contrat trouvé pour cet agent.");
            }

            // Créer une liste des contrats avec les détails
            List<Map<String, Object>> contractsWithDetails = new ArrayList<>();

            for (Contrat contrat : contrats) {
                // Détails de l'agent et de l'utilisateur associés
                Map<String, Object> contractDetails = Map.of(
                        "contratId", contrat.getId(),
                        "isSigned", contrat.isSigned(),
                        "user", Map.of(
                                "name", contrat.getUser().getName(),
                                "email", contrat.getUser().getEmail(),
                                "phone", contrat.getUser().getPhoneNumber(),
                                "address", contrat.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", contrat.getAgent().getName(),
                                "email", contrat.getAgent().getEmail(),
                                "phone", contrat.getAgent().getPhoneNumber(),
                                "address", contrat.getAgent().getAddress()
                        )
                );
                contractsWithDetails.add(contractDetails);
            }

            return ResponseEntity.ok().body(Map.of("contrats", contractsWithDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }

    @PutMapping("/{contratId}/sign")
    public ResponseEntity<?> signContrat(@PathVariable Long contratId) {
        try {
            Contrat contrat = contractService.signContrat(contratId);
            return ResponseEntity.ok(Map.of(
                    "message", "Contrat signé avec succès",
                    "contrat", contrat
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Erreur lors de la signature du contrat",
                    "details", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteContrat(@PathVariable("id") Long id) {
        contractService.DeleteContrat(id);
    }

}