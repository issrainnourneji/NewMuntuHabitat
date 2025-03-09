import { PrestationDetail } from "./facture";
import { TypeSimulation } from "./type-simulation";

export class Devis {

  id!: number;
  userId!: number;
  agentId!: number;
  isSigned!: boolean;
  prestations!: any[];
  sousTotal!: number;
  taxe!: number;
  totalTTC!: number;
  objet!: string;  // Nouveau champ
  adresse!: string;  // Nouveau champ
  standing!: Standing;  // Nouveau champ
  type!: TypeSimulation;
  dateDebut!: string ; // Champ pour la date de début
  duree!: number ;

}


export interface DevisDTO {
  userId: number;
  agentId: number;
  prestations: PrestationDetail[];
  objet: string;  // Nouveau champ
  adresse: string;  // Nouveau champ
  standing: Standing;  // Nouveau champ
  type: TypeSimulation;
  dateDebut: string ; // Champ pour la date de début
  duree: number ;
}


export enum Standing {
  LUXE = 'LUXE',
  MOYEN = 'MOYEN',
  ECONOMIQUE = 'ECONOMIQUE'
}



