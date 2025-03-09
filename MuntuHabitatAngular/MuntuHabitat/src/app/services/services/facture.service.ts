import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Facture, FactureDTO } from '../models/facture';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = 'http://localhost:8080/facture';
  urlDel='http://localhost:8080/facture/delete';

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) {}

 getFacturesByUser(userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token JWT manquant');
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
}
signFacture(factureId: number): Observable<any> {
  const url = `http://localhost:8080/facture/${factureId}/sign`;
  return this.http.put(url, {}, { observe: 'body' });
}
createFacture(factureDTO: FactureDTO): Observable<Facture> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<Facture>(this.apiUrl, factureDTO, { headers });
}

  getFactures(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/all`, { headers });
  }
  getMyFacture(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 return this.http.get<any[]>(`${this.apiUrl}/my-factures`, { headers });
  }

  getMyuserFacture(): Observable<any> {
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
  deleteFacture(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }

}
