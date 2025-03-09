import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Contrat } from '../models/contrat';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8080/contrat';
  urlDel='http://localhost:8080/contrat/delete';

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) {}

 getContratsByUser(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token JWT manquant');
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
}
signContrat(contratId: number): Observable<any> {
  const url = `http://localhost:8080/contrat/${contratId}/sign`;
  return this.http.put(url, {}, { observe: 'body' });
}
createContrat(userId: number): Observable<any> {
  const agentId = this.getAgentIdFromToken(); // Récupérer l'agentId depuis le token

  if (!agentId) {
    throw new Error('Agent ID manquant dans le token');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token JWT manquant');
  }

  // Ajout de l'en-tête Authorization avec le token JWT
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const params = {
    userId: userId.toString(),
    agentId: agentId.toString(),
  };

  return this.http.post<any>(this.apiUrl, null, { params, headers });  // Ajout de l'en-tête 'Authorization'
}
  private getAgentIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || null; // Retourner l'agentId extrait du token
    }
    return null;
  }
  getContrats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  getMyContrats(): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 return this.http.get<any[]>(`${this.apiUrl}/my-contracts`, { headers });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || null;
    }
    return null;
  }

  deleteContrat(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }
}
