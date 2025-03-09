import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/post';
  urlDel='http://localhost:8080/post/delete';

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) {}

  getAllPosts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers });
  }
  addPostForUser(userId: number, title: string, description: string, image: File): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token JWT manquant');
    }

    // Préparer l'en-tête d'Authorization avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    return this.http.post(`${this.apiUrl}/add/${userId}`, formData, { headers });
  }

  getPostsByUser(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  // Dans PostService
getPostsForAgent(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/agentp`, { headers });
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
  deletePost(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }
}
