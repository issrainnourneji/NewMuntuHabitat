import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Prospect } from '../models/prospect';
import { User } from '../models';
import { JwtHelperService } from '@auth0/angular-jwt';
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  authStatuschanged = new EventEmitter<void>();
  private static BASE_URL = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080/user/agents-and-users'; // Assurez-vous que l'URL correspond à votre API

  apiUrlp = 'http://localhost:8080/user/prospects';
  urlup = 'http://localhost:8080/user/up'
  private apiUrlgetP = 'http://localhost:8080/user/assigned';


  constructor(private http: HttpClient) { }
  private jwtHelper = new JwtHelperService();

  private getHeader():HttpHeaders{
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  registerUser(registration: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/register`, registration);
  }

  registerAgent(registration: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/registerAgent`, registration);
  }
  registerProspect(registration: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/registerProspect`, registration);
  }

  loginUser(loginDetails: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/login`, loginDetails);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${TokenService.BASE_URL}/user/my-info`, {
      headers: this.getHeader()
    })
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${TokenService.BASE_URL}/user/get-all`, {
      headers: this.getHeader()
    });
  }

  getProspects(): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(`${TokenService.BASE_URL}/simulation/prospects`);
  }
  getAllProspects(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${TokenService.BASE_URL}/user/getP`,{headers});
  }


  getUserById(id: number): Observable<Prospect[]> {
    return this.http.get<Prospect[]>(`${TokenService.BASE_URL}/simulation/prospect/${id}`);
  }

  getUsersAndAgents(): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.apiUrl, { headers });
  }

  //**
  getAssignedProspects(agentId: number): Observable<any> {
    return this.http.get(`${this.apiUrlgetP}?agentId=${agentId}`);
  }
  private decodeJwt(token: string): any {
    const payload = token.split('.')[1];  // On prend la partie du payload (2ème partie du JWT)
    const decodedPayload = this.base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
  }

  // Fonction pour décoder le base64Url (le format du JWT)
  private base64UrlDecode(base64Url: string): string {
    // Remplacer les caractères non-standards du base64Url pour obtenir un base64 classique
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Ajouter des caractères de padding pour que la longueur soit un multiple de 4
    const padding = base64.length % 4;
    if (padding === 2) {
      base64 += '==';
    } else if (padding === 3) {
      base64 += '=';
    }
    // Décoder le base64 classique
    const decoded = atob(base64);
    return decoded;
  }

  // Fonction pour récupérer l'ID utilisateur à partir du token
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeJwt(token);
      return decodedToken.userId;  // Supposons que le JWT contient "userId" dans son payload
    }
    return null;
  }

  getAgentProspects(): Observable<any> {
    const token = localStorage.getItem('token');  // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.apiUrlp, { headers });
  }

  UpdateUser(data: any): Observable<any> {
    return this.http.put<any>(`${this.urlup}/${data.id}`, data);
  }

  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');  // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${TokenService.BASE_URL}/user/del/${userId}`,{headers});
  }

  deleteToken(userId: number): Observable<any> {
    const token = localStorage.getItem('token');  // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${TokenService.BASE_URL}/user/delT/${userId}`,{headers});
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${TokenService.BASE_URL}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const payload = { token, newPassword };
    return this.http.post<any>(`${TokenService.BASE_URL}/auth/reset-password`, payload);
  }



    logout():void{
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    isAuthenticated():boolean{
      const token = localStorage.getItem('token')
      return !!token;
    }

    isAdmin():boolean {
      const role = localStorage.getItem('role')
      return role === 'ADMIN';
    }
    isClient():boolean {
      const role = localStorage.getItem('role')
      return role === 'USER';
    }
    isAgent():boolean {
      const role = localStorage.getItem('role')
      return role === 'AGENT';
    }
}
