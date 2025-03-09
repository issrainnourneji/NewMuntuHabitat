import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../../services/services/reclamation.service';

@Component({
  selector: 'app-all-reclamations',
  templateUrl: './all-reclamations.component.html',
  styleUrl: './all-reclamations.component.css'
})
export class AllReclamationsComponent implements OnInit {
  reclamations: any[] = []; // Liste des réclamations assignées
  selectedReclamationId: number | null = null;
  newResponse: string = '';
  selectedStatus: string = '';
  filteredReclamations: any[] = [];
  p: number = 1;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  // Charger les réclamations assignées à l'agent
  loadReclamations(): void {
    this.reclamationService.getData().subscribe(
      (data) => {
        this.reclamations = data;
        this.filteredReclamations = [...this.reclamations];

      },
      (error) => {
        console.error('Erreur lors de la récupération des réclamations :', error);
      }
    );
  }

  filterReclamations(): void {
    if (!this.selectedStatus) {
      this.filteredReclamations = [...this.reclamations]; // Afficher toutes les réclamations
    } else {
      this.filteredReclamations = this.reclamations.filter(
        reclamation => reclamation.status === this.selectedStatus
      );
    }
  }


}
