package com.muntu.muntu.Services.Impl;

import com.muntu.muntu.Dto.AppointmentDto;
import com.muntu.muntu.Entity.Appointment;
import com.muntu.muntu.Entity.Chat.Reclamation;
import com.muntu.muntu.Entity.User;
import com.muntu.muntu.Enums.AppointmentStatus;
import com.muntu.muntu.Enums.AppointmentType;
import com.muntu.muntu.Repository.AppointmentRepository;
import com.muntu.muntu.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public Appointment createAppointment(Map<String, Object> request, String clientEmail) {
        // Récupérer le client via son email
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Vérifier si un agent est assigné
        User assignedAgent = client.getAgent();
        if (assignedAgent == null) {
            throw new RuntimeException("No agent assigned to this client");
        }

        // Extraire et valider les détails de la requête
        String appointmentDateStr = (String) request.get("appointmentDate");
        String appointmentTypeStr = (String) request.get("appointmentType");
        String notes = request.getOrDefault("notes", "").toString();

        if (appointmentDateStr == null || appointmentTypeStr == null) {
            throw new IllegalArgumentException("Date and type are required");
        }

        LocalDateTime appointmentDate;
        try {
            appointmentDate = LocalDateTime.parse(appointmentDateStr);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO-8601 format");
        }



        // Créer et sauvegarder le rendez-vous
        Appointment appointment = Appointment.builder()
                .client(client)
                .agent(assignedAgent)
                .appointmentDate(appointmentDate)
                .appointmentType(AppointmentType.valueOf(appointmentTypeStr.toUpperCase()))
                .notes(notes)
                .status(AppointmentStatus.PENDING)
                .build();

        return appointmentRepository.save(appointment);
    }

    public void updateAppointmentStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Appointment> appointments = appointmentRepository.findByStatusAndAppointmentDateBefore(AppointmentStatus.PENDING, now);

        for (Appointment appointment : appointments) {
            appointment.setStatus(AppointmentStatus.MODIFICATION);
            appointmentRepository.save(appointment);
        }
    }

    public void confirmAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found with id " + id));
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setClientId(appointment.getClient().getId());
        dto.setClientEmail(appointment.getClient().getEmail()); // Récupérer l'email du client
        dto.setAgentId(appointment.getAgent().getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentType(appointment.getAppointmentType());
        dto.setNotes(appointment.getNotes());
        dto.setStatus(appointment.getStatus());
        return dto;
    }

    public List<Appointment> getAppointmentsForClient(String clientEmail) {
        return appointmentRepository.findByClientEmail(clientEmail);
    }

    public List<AppointmentDto> getAppointmentsForAgent(String agentEmail) {
        // Trouver l'agent à partir de l'email
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent introuvable avec l'email : " + agentEmail));

        // Filtrer les rendez-vous par agent
        List<Appointment> appointments = appointmentRepository.findByAgent(agent);

        // Convertir les rendez-vous en DTO
        return appointments.stream()
                .map(this::convertToDto)
                .toList(); // Java 16+ ou utiliser .collect(Collectors.toList()) pour les versions antérieures
    }

    public Appointment updateAppointment(Long id, AppointmentDto appointmentDto, String clientEmail) {
        // Vérifiez si le rendez-vous existe
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous introuvable avec l'ID : " + id));

        // Vérifiez si le rendez-vous appartient au client connecté
        if (!appointment.getClient().getEmail().equals(clientEmail)) {
            throw new RuntimeException("Vous ne pouvez pas modifier un rendez-vous qui ne vous appartient pas.");
        }

        // Mettre à jour les propriétés du rendez-vous
        appointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        appointment.setAppointmentType(appointmentDto.getAppointmentType());
        appointment.setNotes(appointmentDto.getNotes());
        appointment.setStatus(appointmentDto.getStatus() != null ? appointmentDto.getStatus() : AppointmentStatus.PENDING); // Default to PENDING

        return appointmentRepository.save(appointment);
    }

    public void changeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found with id " + id));
        appointment.setStatus(AppointmentStatus.MODIFICATION);
        appointmentRepository.save(appointment);
    }

    public void upAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Appointment not found with id " + id));
        appointment.setStatus(AppointmentStatus.UPSUCCESS);
        appointmentRepository.save(appointment);
    }

    public void DeleteAppoitment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> RetrieveAllAppointment() {
        List<Appointment> appointments ;
        appointments = appointmentRepository.findAll();
        return appointments ;
    }
}