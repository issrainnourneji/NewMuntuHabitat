import { Component, OnInit } from '@angular/core';
import {  AppointmentService } from '../../services/services/appointment.service';
import { Appointment } from '../../services/models/appointment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-appointment',
  templateUrl: './list-appointment.component.html',
  styleUrl: './list-appointment.component.css'
})
export class ListAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedAppointments: Appointment[] = []; // Pour stocker plusieurs rendez-vous
  currentMonth: Date = new Date();
daysInMonth: { date: number; status: string; isEmpty: boolean ;   appointments: Appointment[];
}[] = [];
 STATUS_COMPLETED = "COMPLETED";
 showAppointmentTable = false;
 p: number = 1;


  constructor(
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.getAppointmentsForConnectedAgent();
    this.updateCalendar();
    setInterval(() => this.checkAppointments(), 60000);  // 60 seconds interval

  }

  getAppointmentsForConnectedAgent(): void {
    this.appointmentService.getAppointmentsForConnectedAgent().subscribe({
      next: (data) => {
        this.appointments = data;
        this.updateCalendar();
      },
      error: (err) => console.error('Erreur lors du chargement des rendez-vous', err)
    });
  }


  updateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();

    this.daysInMonth = [];

    // Ajouter des jours vides au début pour aligner les jours correctement
    for (let i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
      this.daysInMonth.push({
        date: daysInPrevMonth - i + 1,
        status: '',
        isEmpty: true,
        appointments: []
      });
    }

    // Ajouter les jours du mois en cours et associer un statut
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i);
      const dayAppointments = this.appointments.filter(a => new Date(a.appointmentDate).toDateString() === fullDate.toDateString());
      const dayStatus = this.getAppointmentStatusForDay(fullDate);

      this.daysInMonth.push({
        date: i,
        status: dayStatus,
        isEmpty: false,
        appointments: dayAppointments
      });
    }

    // Ajouter des jours vides à la fin pour compléter la dernière ligne
    const remainingDays = (7 - (this.daysInMonth.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      this.daysInMonth.push({
        date: i,
        status: '',
        isEmpty: true,
        appointments: []
      });
    }
  }

  getAppointmentStatusForDay(date: Date): string {
    // Vérifier les rendez-vous pour une date complète
    const appointment = this.appointments.find(a => new Date(a.appointmentDate).toDateString() === date.toDateString());
    return appointment ? appointment.status : '';
  }

  getDayClass(day: any): string {
    if (day.appointments.length === 0) {
      return 'no-appointments';
    }

    const statuses = day.appointments.map((appointment: any) => appointment.status);

    if (statuses.includes('MODIFICATION')) {
      return 'modification-day';
    }
    if (statuses.includes('PENDING')) {
      return 'pending-day';
    }
    if (statuses.includes('CONFIRMED')) {
      return 'confirmed-day';
    }

    return '';
  }

  getButtonClass(status: string): { class: string; content: string } {
    switch (status) {
      case 'PENDING':
        return { class: 'btn btn-warning', content: 'Changer' };
      case 'MODIFICATION':
        return { class: 'btn btn-warning', content: 'Confirmer' };
      case 'CONFIRMED':
        return { class: 'btn btn-danger', content: '<i class="bi bi-trash"></i>' }; // Icône "Trash"
      default:
        return { class: 'btn btn-secondary', content: 'Action' };
    }
  }


  openAppointmentModal(content: any, day: { date: number, status: string, appointments: Appointment[] }): void {
    if (day.appointments.length > 1) {
      this.selectedAppointments = day.appointments;
    } else {
      this.selectedAppointments = [day.appointments[0]];
    }
    this.modalService.open(content);
  }
  handleAppointment(appointment: Appointment): void {
    if (appointment.status === 'PENDING') {
      this.confirmAppointment(appointment.id);
    } else {
      this.onFinishEditing(appointment.id);
    }
  }

  getStatusClassForDay(day: { date: number, status: string }): string {
    switch (day.status) {
      case 'PENDING': return 'bg-warning';
      case 'CONFIRMED': return 'bg-success';
      case 'MODIFICATION': return 'bg-danger';
      case 'MODIFIED': return 'bg-info';
      default: return '';
    }
  }
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge bg-warning text-dark';
      case 'MODIFICATION':
        return 'badge bg-danger';
      case 'CONFIRMED':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }

  confirmAppointment(appointmentId: number): void {
    this.appointmentService.confirmAppointment(appointmentId).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex((a) => a.id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
          this.updateCalendar();
          window.location.reload()
        }
      },
      error: (err) => console.error('Erreur lors de la confirmation', err)
    });
  }

  changeAppointment(appointmentId: number): void {
    this.appointmentService.changeAppointment(appointmentId).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex((a) => a.id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
          this.updateCalendar();
          window.location.reload()

        }
      },
      error: (err) => console.error('Erreur lors de la modification', err)
    });
  }

  onFinishEditing(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        // Supprimer l'appointment de la liste des appointments
        this.appointments = this.appointments.filter((a) => a.id !== appointmentId);

        // Mettre à jour le statut du jour pour refléter la suppression
        this.updateDayStatusAfterDeletion(appointmentId);
      },
      error: (err) => console.error('Erreur lors de la suppression', err)
    });
  }

  updateDayStatusAfterDeletion(appointmentId: number): void {
    // Mettre à jour le statut du jour
    this.daysInMonth.forEach(day => {
      day.appointments = day.appointments.filter(a => a.id !== appointmentId);
      if (day.appointments.length === 0) {
        day.status = '';
      }
    });
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.updateCalendar();  // Mettre à jour le calendrier après avoir changé le mois
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateCalendar();  // Mettre à jour le calendrier après avoir changé le mois
  }

  toggleAppointmentTable() {
    this.showAppointmentTable = !this.showAppointmentTable;
  }

  checkAppointments(): void {
    const currentTime = new Date();
    const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    this.appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      if (appointmentDate <= twoHoursLater && appointmentDate > currentTime) {
        alert(`Rappel : Vous avez un rendez-vous "${appointment.notes}" dans 2 heures à ${appointmentDate.toLocaleTimeString()}`);
      }
    });
  }
}
