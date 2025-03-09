import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/services/appointment.service';
import { Appointment } from '../../services/models/appointment';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent implements OnInit {
  rendezv = {
    id: 0, // Ajouté pour permettre la modification
    agentId: null,
    appointmentDate: '',
    appointmentType: '',
    notes: '',
    status: '', // Ajoutez un statut par défaut
  };
  appointments: Appointment[] = [];
  agent: any; // Stocke l'agent assigné
  isEditMode: boolean = false;
p : number =1
isAscending: boolean = true;
minDateTime: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private userService: TokenService,
    private router: Router,
     private notifService:NotificationService
  ) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentsForClient().subscribe(
      (data) => {
        this.appointments = data;
        this.sortAppointments();
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous client', error);
      }
    );
    this.loadAgent();
    this.minDateTime = new Date().toISOString().slice(0, 16);

  }

  loadAgent(): void {
    this.userService.getUsersAndAgents().subscribe(
      (response) => {
        if (response.user) {
          this.agent = response.user;
          this.rendezv.agentId = this.agent.id; // Assigner automatiquement l'ID de l'agent
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’agent', error);
      }
    );
  }
  validateForm(): boolean {
    const { appointmentDate, appointmentType, notes } = this.rendezv;
    const now = new Date();
    const selectedDate = new Date(appointmentDate);

    if (!appointmentDate) {
      this.notifService.error('Veuillez sélectionner une date.');
      return false;
    }

    if (selectedDate <= now) {
      this.notifService.error('La date du rendez-vous doit être dans le futur.');
      return false;
    }

    if (!appointmentType) {
      this.notifService.error('Veuillez sélectionner un type de rendez-vous.');
      return false;
    }

    if (!notes || notes.trim().length < 10) {
      this.notifService.error('Les notes doivent contenir au moins 10 caractères.');
      return false;
    }

    return true;
  }

  confirmAddAppointment(): void {
    if (!this.validateForm()) {
      return;
    }
    this.appointmentService.addAppointment(this.rendezv).subscribe({
      next: (response) => {
        console.log('Rendez-vous ajouté avec succès :', response);
        // Vérifier que l'élément modal existe avant d'essayer de le cacher
        const modalElement = document.getElementById('appointmentModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du rendez-vous :', err);
        alert('Une erreur est survenue.');
      },
    });
  }

  onEditAppointment(appointment: Appointment): void {
    // Préremplir le formulaire avec les données du rendez-vous sélectionné
    this.rendezv.id = appointment.id;
    this.rendezv.appointmentDate = appointment.appointmentDate;
    this.rendezv.appointmentType = appointment.appointmentType;
    this.rendezv.notes = appointment.notes;
    this.rendezv.status = appointment.status;
    this.isEditMode = true; // Afficher le formulaire de modification
  }

  updateAppointment(): void {
    if (!this.validateForm()) {
      return;
    }    if (this.rendezv.id) {
      this.appointmentService.updateAppointment(this.rendezv).subscribe(
        (response) => {
          console.log('Rendez-vous mis à jour avec succès :', response);
          this.isEditMode = false; // Fermer le formulaire après la mise à jour
          this.notifService.success('Rendez-vous mis à jour avec succès !')
          window.location.reload();

        },
        (error) => {
          console.error('Erreur lors de la mise à jour du rendez-vous :', error);
          alert('Une erreur est survenue.');
        }
      );
    } else {
      alert('Veuillez sélectionner un rendez-vous à modifier.');
    }
  }
  onFinishEditing(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        // Supprimer l'appointment de la liste des appointments
        this.appointments = this.appointments.filter((a) => a.id !== appointmentId);

        // Mettre à jour le statut du jour pour refléter la suppression
      },
      error: (err) => console.error('Erreur lors de la suppression', err)
    });
  }
  sortAppointments(): void {
    this.appointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.sortAppointments();
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
