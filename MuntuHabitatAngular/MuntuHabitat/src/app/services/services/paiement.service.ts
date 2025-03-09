import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paiement } from "../models/paiement.";

@Injectable({
  providedIn: 'root',
})
export class PaiementService {
  private apiUrl = 'http://localhost:8080/payer';

  constructor(private http: HttpClient) { }

  effectuerPaiement(factureId: number, methodePaiement: string, referenceTransaction: string): Observable<Paiement> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est dans le localStorage

    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Paiement>(`${this.apiUrl}/effectuer`, {
      factureId,
      methodePaiement,
      referenceTransaction
    }, { headers });
  }

  validerPaiement(paiementId: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${paiementId}/valider`, {});
  }

}
