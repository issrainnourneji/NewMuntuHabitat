import { PrestationPrix } from "./prestationPrix";

export class Facture {

  id?: number;
  userId!: number;
  agentId!: number;
  isSigned!: boolean;
  prestations!: any[];
  sousTotal!: number;
  taxe!: number;
  totalTTC!: number;

}
// DTO pour la création de facture
export interface PrestationDetail {
  prestationId: number;
  quantite: number;
  montantTotal: number;
}

export interface FactureDTO {
  userId: number;
  agentId: number;
  prestations: PrestationDetail[];
}
export interface SelectedPrestation {
  prestation: PrestationPrix;
  quantite: number;
  montantTotal: number;
}
