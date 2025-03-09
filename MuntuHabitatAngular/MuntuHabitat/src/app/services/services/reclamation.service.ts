import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private baseUrl = 'http://localhost:8080/reclamation';
  urlDel='http://localhost:8080/reclamation/delete';
  urlApi='http://localhost:8080/reclamation/all'

  constructor(private http: HttpClient) {}
  createReclamation(reclamation: { objet: string; description: string }): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}`, reclamation , { headers });
  }

  // Récupérer les réclamations assignées à l'agent connecté
  getReclamations(): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}`, { headers });
  }

  // Répondre à une réclamation
  respondToReclamation(reclamationId: number, responseText: string): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = { response: responseText };
    return this.http.post(`${this.baseUrl}/${reclamationId}/respond`, payload , { headers });
  }

  updateReclamationResponse(id: number, newResponse: string): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}/updateresponse`, { newResponse }, { headers })
    .pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour de la réponse', error);
        return throwError(error);
      })
    );
  }
  deleteReclamation(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }

    getData():Observable<any[]> {
      return this.http.get<any[]>(this.urlApi);
  }
}
