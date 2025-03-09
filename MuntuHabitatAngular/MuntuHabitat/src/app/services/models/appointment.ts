export interface Appointment {
  id: number;
  clientId: number;
  clientEmail: string; // Nouvel attribut
  agentId: number;
  appointmentDate: string;
  appointmentType: string;
  notes: string;
  notificationSent: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'MODIFICATION'|'MODIFIED';
}
