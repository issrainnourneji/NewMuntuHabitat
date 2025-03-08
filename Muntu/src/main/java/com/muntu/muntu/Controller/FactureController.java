package com.muntu.muntu.Controller;


import com.muntu.muntu.Dto.FactureDTO;
import com.muntu.muntu.Entity.Document.Facture;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.Prestation.FacturePrestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Services.Impl.FactureServiceImpl;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/facture")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class FactureController {
    private final FactureServiceImpl factureService;
    private final UserServiceImpl userService;


    @PostMapping
    public ResponseEntity<?> createFacture(@RequestBody FactureDTO factureDTO) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.badRequest().body("Agent introuvable.");
            }

            factureDTO.setAgentId(agent.getId());
            Facture facture = factureService.createFacture(factureDTO);

            // Transformez la facture en DTO pour éviter les relations complexes
            FactureDTO responseDTO = factureService.mapToDTO(facture);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + e.getMessage());
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de base de données.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue s'est produite.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFacturesByUser(@PathVariable Long userId) {
        try {
            List<Facture> factures = factureService.getFactureByUser(userId);
            User user = userService.getUserById(userId);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Extraction des informations de l'utilisateur
            Map<String, Object> userDetails = Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhoneNumber(),
                    "address", user.getAddress()
            );

            // Gestion de l'agent si disponible
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

            // Renvoi des données sous forme de réponse
            return ResponseEntity.ok().body(Map.of(
                    "user", userDetails,
                    "factures", factures,  // Assurez-vous que `factures` est une liste plate
                    "agent", agentDetails
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }

    @GetMapping("/my-factures")
    public ResponseEntity<?> getMyFactures() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Utilisateur authentifié: " + userDetails.getUsername());

            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Agent non trouvé");
            }

            System.out.println("Agent trouvé: " + agent.getEmail());

            List<Facture> factures = factureService.getFacturesByAgent(agent);

            if (factures.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune facture trouvée pour cet agent.");
            }

            List<Map<String, Object>> facturesWithDetails = new ArrayList<>();

            for (Facture facture : factures) {
                List<Map<String, Object>> prestationDetails = new ArrayList<>();

                for (FacturePrestation facturePrestation : facture.getFacturePrestations()) {
                    Prestation prestation = facturePrestation.getPrestation();
                    Map<String, Object> prestationDetail = Map.of(
                            "prestationId", prestation.getId(),
                            "quantite", facturePrestation.getQuantite(),
                            "montantTotal", facturePrestation.getMontantTotal(),
                            "designation", prestation.getDesignation(),
                            "lot", prestation.getLot().name(), // En Java, c'est un enum, donc on peut appeler `.name()` pour obtenir la valeur sous forme de chaîne.
                            "prixUnitaire", prestation.getPrixUnitaire(),
                            "unite", prestation.getUnite().name() // idem pour l'énumération 'Unite'
                    );
                    prestationDetails.add(prestationDetail);
                }

                Map<String, Object> factureDetails = Map.of(
                        "factureId", facture.getId(),
                        "isSigned", facture.isSigned(),
                        "sousTotal", facture.getSousTotal(),
                        "taxe", facture.getTaxe(),
                        "totalTTC", facture.getTotalTTC(),
                        "user", Map.of(
                                "name", facture.getUser().getName(),
                                "email", facture.getUser().getEmail(),
                                "phone", facture.getUser().getPhoneNumber(),
                                "address", facture.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", facture.getAgent().getName(),
                                "email", facture.getAgent().getEmail(),
                                "phone", facture.getAgent().getPhoneNumber(),
                                "address", facture.getAgent().getAddress()
                        ),
                        "prestations", prestationDetails
                );
                facturesWithDetails.add(factureDetails);
            }

            return ResponseEntity.ok().body(Map.of("factures", facturesWithDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }

    @GetMapping("/userf")
    public ResponseEntity<?> getMyuserFactures() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Utilisateur authentifié: " + userDetails.getUsername());

            User user = userService.findByEmail(userDetails.getUsername());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Agent non trouvé");
            }

            System.out.println("Agent trouvé: " + user.getEmail());

            List<Facture> factures = factureService.getFactureByUser(user.getId());

            if (factures.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune facture trouvée pour cet user.");
            }

            List<Map<String, Object>> facturesWithDetails = new ArrayList<>();

            for (Facture facture : factures) {
                List<Map<String, Object>> prestationDetails = new ArrayList<>();

                for (FacturePrestation facturePrestation : facture.getFacturePrestations()) {
                    Prestation prestation = facturePrestation.getPrestation();
                    Map<String, Object> prestationDetail = Map.of(
                            "prestationId", prestation.getId(),
                            "quantite", facturePrestation.getQuantite(),
                            "montantTotal", facturePrestation.getMontantTotal(),
                            "designation", prestation.getDesignation(),
                            "lot", prestation.getLot().name(), // En Java, c'est un enum, donc on peut appeler `.name()` pour obtenir la valeur sous forme de chaîne.
                            "prixUnitaire", prestation.getPrixUnitaire(),
                            "unite", prestation.getUnite().name() // idem pour l'énumération 'Unite'
                    );
                    prestationDetails.add(prestationDetail);
                }

                Map<String, Object> factureDetails = Map.of(
                        "factureId", facture.getId(),
                        "isSigned", facture.isSigned(),
                        "sousTotal", facture.getSousTotal(),
                        "taxe", facture.getTaxe(),
                        "totalTTC", facture.getTotalTTC(),
                        "user", Map.of(
                                "name", facture.getUser().getName(),
                                "email", facture.getUser().getEmail(),
                                "phone", facture.getUser().getPhoneNumber(),
                                "address", facture.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", facture.getAgent().getName(),
                                "email", facture.getAgent().getEmail(),
                                "phone", facture.getAgent().getPhoneNumber(),
                                "address", facture.getAgent().getAddress()
                        ),
                        "prestations", prestationDetails
                );
                facturesWithDetails.add(factureDetails);
            }

            return ResponseEntity.ok().body(Map.of("factures", facturesWithDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }

    @PutMapping("/{factureId}/sign")
    public ResponseEntity<?> signFacture(@PathVariable Long factureId) {
        try {
            Facture facture = factureService.signFacture(factureId);
            return ResponseEntity.ok(Map.of(
                    "message", "Facture signé avec succès",
                    "facture", facture
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Erreur lors de la signature du facture",
                    "details", e.getMessage()
            ));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllFacturesForAgent() {
        try {
            List<Facture> factures = factureService.getAllFactureForAgent();

            if (factures.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> facturesWithUserDetails = new ArrayList<>();

            for (Facture facture : factures) {
                User agent = facture.getAgent();

                Map<String, Object> agentDetails = Map.of(
                        "name", agent.getName(),
                        "email", agent.getEmail(),
                        "phone", agent.getPhoneNumber(),
                        "address", agent.getAddress()
                );

                User user = facture.getUser();

                Map<String, Object> userDetails = Map.of(
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhoneNumber(),
                        "address", user.getAddress()
                );

                Map<String, Object> factureDetails = Map.of(
                        "factureId", facture.getId(),
                        "isSigned", facture.isSigned(),
                        "user", userDetails,
                        "agent", agentDetails
                );

                facturesWithUserDetails.add(factureDetails);
            }

            return ResponseEntity.ok().body(Map.of(
                    "factures", facturesWithUserDetails
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFacture(@PathVariable("id") Long id) {
        factureService.DeleteFacture(id);
    }

}



