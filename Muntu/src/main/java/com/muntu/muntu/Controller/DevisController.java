package com.muntu.muntu.Controller;

import com.muntu.muntu.Dto.DevisDTO;
import com.muntu.muntu.Entity.Document.Devis;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.Prestation.DevisPrestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Services.Impl.DevisServiceImpl;
import com.muntu.muntu.Services.Impl.UserServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/devis")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class DevisController {
    private final UserServiceImpl userService;
    private final DevisServiceImpl devisService;


    @PostMapping
    public ResponseEntity<?> createDevis(@RequestBody DevisDTO devisDTO) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.badRequest().body("Agent introuvable.");
            }

            devisDTO.setAgentId(agent.getId());
            Devis devis = devisService.createDevis(devisDTO);

            DevisDTO responseDTO = devisService.mapToDTO(devis);

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
    public ResponseEntity<?> getDevisByUser(@PathVariable Long userId) {
        try {
            List<Devis> devis = devisService.getDevisByUser(userId);
            User user = userService.getUserById(userId);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> userDetails = Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "phone", user.getPhoneNumber(),
                    "address", user.getAddress()
            );

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

            return ResponseEntity.ok().body(Map.of(
                    "user", userDetails,
                    "devis", devis,
                    "agent", agentDetails
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDevisForAgent() {
        try {
            List<Devis> devis = devisService.getAllDevisForAgent();

            if (devis.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> devisWithUserDetails = new ArrayList<>();

            for (Devis devis1 : devis) {
                List<Map<String, Object>> prestationDetails = new ArrayList<>();

                for (DevisPrestation devisPrestation : devis1.getDevisPrestations()) {
                    Prestation prestation = devisPrestation.getPrestation();
                    prestationDetails.add(Map.of(
                            "prestationId", prestation.getId(),
                            "quantite", devisPrestation.getQuantite(),
                            "montantTotal", devisPrestation.getMontantTotal(),
                            "designation", prestation.getDesignation(),
                            "lot", prestation.getLot().name(),
                            "prixUnitaire", prestation.getPrixUnitaire(),
                            "unite", prestation.getUnite().name()
                    ));
                }

                // Diviser les détails de devis en deux sous-maps
                Map<String, Object> detailsDevisPart1 = Map.of(
                        "devisId", devis1.getId(),
                        "isSigned", devis1.isSigned(),
                        "sousTotal", devis1.getSousTotal(),
                        "taxe", devis1.getTaxe(),
                        "totalTTC", devis1.getTotalTTC(),
                        "dateDebut",devis1.getDateDebut()

                );

                Map<String, Object> detailsDevisPart2 = Map.of(
                        "objet", devis1.getObjet(),
                        "adresse", devis1.getAdresse(),
                        "standing", devis1.getStanding().name(),
                        "type", devis1.getType().name(),
                        "duree",devis1.getDuree(),

                        "user", Map.of(
                                "name", devis1.getUser().getName(),
                                "email", devis1.getUser().getEmail(),
                                "phone", devis1.getUser().getPhoneNumber(),
                                "address", devis1.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", devis1.getAgent().getName(),
                                "email", devis1.getAgent().getEmail(),
                                "phone", devis1.getAgent().getPhoneNumber(),
                                "address", devis1.getAgent().getAddress()
                        )
                );

                // Fusionner les sous-maps avec prestations
                Map<String, Object> devisDetails = new HashMap<>(detailsDevisPart1);
                devisDetails.putAll(detailsDevisPart2);
                devisDetails.put("prestations", prestationDetails);

                devisWithUserDetails.add(devisDetails);
            }

            return ResponseEntity.ok().body(Map.of("devis", devisWithUserDetails));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur");
        }
    }

    @GetMapping("/my-devis")
    public ResponseEntity<?> getMyDevis() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Utilisateur authentifié: " + userDetails.getUsername());

            User agent = userService.findByEmail(userDetails.getUsername());

            if (agent == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Agent non trouvé");
            }

            System.out.println("Agent trouvé: " + agent.getEmail());

            List<Devis> devis = devisService.getDevisByAgent(agent);

            if (devis.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun devis trouvé pour cet agent.");
            }

            List<Map<String, Object>> devisWithUserDetails = new ArrayList<>();

            for (Devis devis1 : devis) {
                List<Map<String, Object>> prestationDetails = new ArrayList<>();

                for (DevisPrestation devisPrestation : devis1.getDevisPrestations()) {
                    Prestation prestation = devisPrestation.getPrestation();
                    prestationDetails.add(Map.of(
                            "prestationId", prestation.getId(),
                            "quantite", devisPrestation.getQuantite(),
                            "montantTotal", devisPrestation.getMontantTotal(),
                            "designation", prestation.getDesignation(),
                            "lot", prestation.getLot().name(),
                            "prixUnitaire", prestation.getPrixUnitaire(),
                            "unite", prestation.getUnite().name()
                    ));
                }

                // Diviser les détails de devis en deux sous-maps
                Map<String, Object> detailsDevisPart1 = Map.of(
                        "devisId", devis1.getId(),
                        "isSigned", devis1.isSigned(),
                        "sousTotal", devis1.getSousTotal(),
                        "taxe", devis1.getTaxe(),
                        "totalTTC", devis1.getTotalTTC(),
                        "dateDebut",devis1.getDateDebut()

                        );

                Map<String, Object> detailsDevisPart2 = Map.of(
                        "objet", devis1.getObjet(),
                        "adresse", devis1.getAdresse(),
                        "standing", devis1.getStanding().name(),
                        "type", devis1.getType().name(),
                 "duree",devis1.getDuree(),

                "user", Map.of(
                                "name", devis1.getUser().getName(),
                                "email", devis1.getUser().getEmail(),
                                "phone", devis1.getUser().getPhoneNumber(),
                                "address", devis1.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", devis1.getAgent().getName(),
                                "email", devis1.getAgent().getEmail(),
                                "phone", devis1.getAgent().getPhoneNumber(),
                                "address", devis1.getAgent().getAddress()
                        )
                );

                // Fusionner les sous-maps avec prestations
                Map<String, Object> devisDetails = new HashMap<>(detailsDevisPart1);
                devisDetails.putAll(detailsDevisPart2);
                devisDetails.put("prestations", prestationDetails);

                devisWithUserDetails.add(devisDetails);
            }

            return ResponseEntity.ok().body(Map.of("devis", devisWithUserDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }


    @GetMapping("/userf")
    public ResponseEntity<?> getMyuserDevis() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Utilisateur authentifié: " + userDetails.getUsername());

            User user = userService.findByEmail(userDetails.getUsername());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Utilisateur non trouvé");
            }

            System.out.println("Utilisateur trouvé: " + user.getEmail());

            List<Devis> deviss = devisService.getDevisByUser(user.getId());

            if (deviss.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun devis trouvé pour cet utilisateur.");
            }

            List<Map<String, Object>> devissWithDetails = new ArrayList<>();

            for (Devis devis : deviss) {
                List<Map<String, Object>> prestationDetails = new ArrayList<>();

                for (DevisPrestation devisPrestation : devis.getDevisPrestations()) {
                    Prestation prestation = devisPrestation.getPrestation();
                    prestationDetails.add(Map.of(
                            "prestationId", prestation.getId(),
                            "quantite", devisPrestation.getQuantite(),
                            "montantTotal", devisPrestation.getMontantTotal(),
                            "designation", prestation.getDesignation(),
                            "lot", prestation.getLot().name(),
                            "prixUnitaire", prestation.getPrixUnitaire(),
                            "unite", prestation.getUnite().name()
                    ));
                }

                // Diviser les détails de devis en deux sous-maps
                Map<String, Object> detailsDevisPart1 = Map.of(
                        "devisId", devis.getId(),
                        "isSigned", devis.isSigned(),
                        "sousTotal", devis.getSousTotal(),
                        "taxe", devis.getTaxe(),
                        "totalTTC", devis.getTotalTTC(),
                        "dateDebut",devis.getDateDebut()

                );

                Map<String, Object> detailsDevisPart2 = Map.of(
                        "objet", devis.getObjet(),
                        "adresse", devis.getAdresse(),
                        "standing", devis.getStanding().name(),
                        "type", devis.getType().name(),
                        "duree",devis.getDuree(),

                        "user", Map.of(
                                "name", devis.getUser().getName(),
                                "email", devis.getUser().getEmail(),
                                "phone", devis.getUser().getPhoneNumber(),
                                "address", devis.getUser().getAddress()
                        ),
                        "agent", Map.of(
                                "name", devis.getAgent().getName(),
                                "email", devis.getAgent().getEmail(),
                                "phone", devis.getAgent().getPhoneNumber(),
                                "address", devis.getAgent().getAddress()
                        )
                );

                // Fusionner les sous-maps avec prestations
                Map<String, Object> devisDetails = new HashMap<>(detailsDevisPart1);
                devisDetails.putAll(detailsDevisPart2);
                devisDetails.put("prestations", prestationDetails);

                devissWithDetails.add(devisDetails);
            }

            return ResponseEntity.ok().body(Map.of("deviss", devissWithDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }





    @PutMapping("/{devisId}/sign")
    public ResponseEntity<?> signDevis(@PathVariable Long devisId) {
        try {
            Devis devis = devisService.signDevis(devisId);
            return ResponseEntity.ok(Map.of(
                    "message", "devis signé avec succès",
                    "devis", devis
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Erreur lors de la signature du devis",
                    "details", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDevis(@PathVariable("id") Long id) {
        devisService.DeleteDevis(id);
    }

}
