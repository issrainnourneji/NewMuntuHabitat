package com.muntu.muntu.Controller;
import com.muntu.muntu.Dto.ReclamationRequest;
import com.muntu.muntu.Dto.Response;
import com.muntu.muntu.Entity.Chat.Reclamation;
import com.muntu.muntu.Entity.Document.Prestation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Repository.UserRepository;
import com.muntu.muntu.Services.Impl.ReclamationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/reclamation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReclamationController {
    private final ReclamationServiceImpl reclamationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReclamation(@RequestBody ReclamationRequest request) {
        try {
            Reclamation reclamation = reclamationService.createReclamation(request.getObjet(), request.getDescription());
            return ResponseEntity.status(HttpStatus.CREATED).body(reclamation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getReclamations() {
        try {
            return reclamationService.getReclamations();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<Response> respondToReclamation(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        String responseText = payload.get("response");

        if (responseText == null || responseText.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Response text cannot be empty.")
                            .build()
            );
        }

        Response response = reclamationService.respondToReclamation(id, responseText);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{id}/updateresponse")
    public ResponseEntity<Map<String, String>> updateReclamationResponse(@PathVariable("id") Long reclamationId,
                                                                         @RequestBody String newResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String agentEmail = authentication.getName(); // Email de l'agent connecté

        boolean success = reclamationService.updateReclamationResponse(reclamationId, newResponse, agentEmail);

        if (success) {
            // Renvoie un objet JSON contenant un message de succès
            Map<String, String> response = new HashMap<>();
            response.put("message", "Réponse mise à jour avec succès.");
            return ResponseEntity.ok(response); // Code 200 OK avec JSON
        } else {
            // Renvoie un message d'erreur sous forme de JSON
            Map<String, String> response = new HashMap<>();
            response.put("message", "Vous n'êtes pas autorisé à modifier cette réclamation.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response); // Code 403 Forbidden avec JSON
        }
    }
    @DeleteMapping("/delete/{id}")
    public void deleteReclamation(@PathVariable("id") Long id) {
        reclamationService.DeleteReclamation(id);
    }


    @GetMapping("/all")
    public List<Reclamation> getAllReclamation() {
        return reclamationService.RetrieveAllReclamation();
    }

}
