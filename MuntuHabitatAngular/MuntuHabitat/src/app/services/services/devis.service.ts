import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Devis, DevisDTO } from '../models/devis';

@Injectable({
  providedIn: 'root',
})
export class DevisService {
  private apiUrl = 'http://localhost:8080/devis';
  urlDel='http://localhost:8080/devis/delete';

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) {}

 getDevisByUser(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token JWT manquant');
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
}
signDevis(devisId: number): Observable<any> {
  const url = `http://localhost:8080/devis/${devisId}/sign`;
  return this.http.put(url, {}, { observe: 'body' });
}


createDevis(devisDTO: DevisDTO): Observable<Devis> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<Devis>(this.apiUrl, devisDTO, { headers });
}
  private getAgentIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || null;
    }
    return null;
  }
  getDevis(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  getMyDevis(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 return this.http.get<any[]>(`${this.apiUrl}/my-devis`, { headers });
  }

  getMyuserDevis(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/userf`, { headers });
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
  deleteDevis(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }

}
