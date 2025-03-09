import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { PrestationPrix } from '../models/prestationPrix';

@Injectable({
  providedIn: 'root'
})
export class PrestationPrixService {
  urlAdd='http://localhost:8080/Prestation/add';
  urlApi = 'http://localhost:8080/Prestation/all';
  urlDel='http://localhost:8080/Prestation/delete';
  urlById =  'http://localhost:8080/Prestation/get';
  urlup='http://localhost:8080/Prestation/update';
  PrestationPrix=[];
  constructor(private http: HttpClient) { }
  getData():Observable<PrestationPrix[]> {
    return this.http.get<PrestationPrix[]>(this.urlApi);
}
addPrestation(PrestationPrix: PrestationPrix):Observable<PrestationPrix>{
    return this.http.post<PrestationPrix>(this.urlAdd,PrestationPrix)
   }
   deletePrestation(id:Number){
    return this.http.delete(this.urlDel+'/'+id);
  }
  getPrestationById(id: Number){
    return this.http.get<PrestationPrix>(this.urlById+'/'+id);
  }
  UpdatePrestation(prestationPrix:PrestationPrix){
    alert("success update");
    return this.http.put<PrestationPrix>(this.urlup, prestationPrix);
  }

  }



