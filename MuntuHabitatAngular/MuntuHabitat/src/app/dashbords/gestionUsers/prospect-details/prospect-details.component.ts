import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../../services/services/contrat.service';
import { Contrat } from '../../../services/models/contrat';

@Component({
  selector: 'app-prospect-details',
  templateUrl: './prospect-details.component.html',
  styleUrl: './prospect-details.component.css'
})
export class ProspectDetailsComponent implements OnInit {
  contrats: any[] = [];
  selectedContrat: Contrat | null = null; // Variable pour stocker le contrat sélectionné
p : number =1

  constructor(private contratService: ContractService) { }

  ngOnInit(): void {
    this.loadContrats();
  }

  // Charger les contrats du backend
  loadContrats(): void {
    this.contratService.getContrats().subscribe(
      (response) => {
        if (response && response.contrats) {
          this.contrats = response.contrats;
        } else {
          console.error('Aucun contrat trouvé');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des contrats', error);
      }
    );
  }

  selectContrat(contrat: any): void {
    if (this.selectedContrat === contrat) {
      this.selectedContrat = null;  // Si le contrat est déjà sélectionné, désélectionnez-le
    } else {
      this.selectedContrat = contrat;  // Sélectionnez le contrat
    }
  }
}
