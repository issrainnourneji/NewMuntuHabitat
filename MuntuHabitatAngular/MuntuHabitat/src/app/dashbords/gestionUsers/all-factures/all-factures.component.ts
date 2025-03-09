import { Component, OnInit } from '@angular/core';
import { Facture } from '../../../services/models/facture';
import { FactureService } from '../../../services/services/facture.service';

@Component({
  selector: 'app-all-factures',
  templateUrl: './all-factures.component.html',
  styleUrl: './all-factures.component.css'
})
export class AllFacturesComponent implements OnInit {
  factures: any[] = [];
  selectedFacture: Facture | null = null;
p : number =1

  constructor(private factureService: FactureService) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.factureService.getFactures().subscribe(
      (response) => {
        if (response && response.factures) {
          this.factures = response.factures;
        } else {
          console.error('Aucun facture trouvé');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }

  selectFacture(facture: any): void {
    if (this.selectedFacture === facture) {
      this.selectedFacture = null;  
    } else {
      this.selectedFacture = facture;
    }
  }
}
