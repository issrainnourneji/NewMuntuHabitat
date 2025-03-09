import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Appointment } from '../models/appointment';


@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/rendezvous';
  urlDel='http://localhost:8080/rendezvous/delete';


  constructor(private http: HttpClient) {}

  addAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, appointment, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  confirmAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/confirm`, {});
  }


  getAppointmentsForClient(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/forclient`, { headers });
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAppointmentsForConnectedAgent(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/foragent`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Erreur lors de la récupération des rendez-vous.'));
      }));
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`/api/appointments/${id}`);
  }

  updateAppointment(rendezv: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update/${rendezv.id}`, rendezv, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Erreur lors de la récupération des rendez-vous.'));
      }));
  }

  changeAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/change`, {});
  }
 upAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/up`, {});
  }

  deleteAppointment(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }

}
