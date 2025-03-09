export class LigneFacture {
  descriptionProduit: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;

  constructor(init?: Partial<LigneFacture>) {
    this.descriptionProduit = init?.descriptionProduit || '';
    this.quantite = init?.quantite || 0;
    this.prixUnitaire = init?.prixUnitaire || 0;
    this.montantTotal = this.quantite * this.prixUnitaire;
  }
}
