import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token/token.service';
import { Prospect } from '../../../services/models/prospect';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-prospect-assign-list',
  templateUrl: './prospect-assign-list.component.html',
  styleUrl: './prospect-assign-list.component.css'
})
export class ProspectAssignListComponent implements OnInit {
  prospects: any[] = [];  // Liste des prospects
  selectedProspect: any | null = null;  // Propriété pour stocker le prospect sélectionné
  p: number = 1;
  agentId: number | null = null;
    constructor(private prospectSelectionService: TokenService) { }

    ngOnInit(): void {
      this.loadAgentId();
      this.loadProspects();
    }

    loadAgentId() {
      this.agentId = this.prospectSelectionService.getUserIdFromToken();
    }

  loadProspects() {
    this.prospectSelectionService.getAssignedProspects(this.agentId!).subscribe(
      (response) => {
        this.prospects = response;
      },
      (error) => {
        console.error('Erreur lors du chargement des prospects:', error);
      }
    );
  }
  openModal(prospect: Prospect): void {
    this.selectedProspect = prospect;

    // Vérifier si l'élément du modal existe
    const modalElement = document.getElementById('prospectModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


}
