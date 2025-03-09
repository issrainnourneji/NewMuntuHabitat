export interface Paiement {
  id: number;
  factureId: number;
  montant: number;
  datePaiement: Date;
  statutPaiement: string;
  methodePaiement: string;
  referenceTransaction: string;
}
