package com.muntu.muntu.Controller;

import com.muntu.muntu.Dto.AppointmentDto;
import com.muntu.muntu.Entity.Appointment;
import com.muntu.muntu.Entity.Chat.Reclamation;
import com.muntu.muntu.Enums.AppointmentStatus;
import com.muntu.muntu.Repository.AppointmentRepository;
import com.muntu.muntu.Services.Impl.AppointmentServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/rendezvous")
@AllArgsConstructor
@CrossOrigin(origins = "*")

public class AppointmentController {

    private final AppointmentServiceImpl appointmentService;

    @PostMapping("/add")
    public ResponseEntity<?> addAppointment(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            // Appel du service pour créer le rendez-vous
            Appointment appointment = appointmentService.createAppointment(request, principal.getName());
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            // Gestion des erreurs personnalisées
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
    @GetMapping("/forclient")
    public ResponseEntity<List<Appointment>> getAppointmentsForClient(Authentication authentication) {
        String clientEmail = authentication.getName(); // Récupère l'email de l'utilisateur connecté
        List<Appointment> appointments = appointmentService.getAppointmentsForClient(clientEmail);
        return ResponseEntity.ok(appointments);
    }


    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmAppointment(@PathVariable Long id) {
        appointmentService.confirmAppointment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<AppointmentDto> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/foragent")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsForAgent(Authentication authentication) {
        String agentEmail = authentication.getName(); // Récupère l'email de l'agent connecté
        List<AppointmentDto> appointments = appointmentService.getAppointmentsForAgent(agentEmail);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable("id") Long id,
                                                         @RequestBody AppointmentDto appointmentDto,
                                                         Authentication authentication) {
        String clientEmail = authentication.getName(); // Récupère l'email de l'utilisateur connecté
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDto, clientEmail);
        return ResponseEntity.ok(updatedAppointment);
    }
    @PatchMapping("/{id}/change")
    public ResponseEntity<Void> changeAppointment(@PathVariable Long id) {
        appointmentService.changeAppointment(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/up")
    public ResponseEntity<Void> upAppointment(@PathVariable Long id) {
        appointmentService.upAppointment(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRDV(@PathVariable("id") Long id) {
        appointmentService.DeleteAppoitment(id);
    }

    @GetMapping("/all")
    public List<Appointment> getAllAppointment() {
        return appointmentService.RetrieveAllAppointment();
    }

}
