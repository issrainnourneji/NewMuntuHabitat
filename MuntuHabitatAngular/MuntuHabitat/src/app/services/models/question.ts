/* tslint:disable */
/* eslint-disable */
import { Categorie } from '../models/categorie';
import { TypeSimulation } from './type-simulation';
export interface Question {
  categories?: Array<Categorie>;
  createdBy?: string;
  createdDate?: string;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  text?: string;
  type: TypeSimulation
}
