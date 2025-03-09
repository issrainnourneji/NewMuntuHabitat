import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../services/services/reclamation.service';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrl: './reclamation-list.component.css'
})
export class ReclamationListComponent implements OnInit {
  reclamations: any[] = []; // Liste des réclamations assignées
  selectedReclamationId: number | null = null;
  newResponse: string = '';
  selectedStatus: string = '';
  filteredReclamations: any[] = [];
  p: number = 1;
  filterEmail: string = '';
  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  // Charger les réclamations assignées à l'agent
  loadReclamations(): void {
    this.reclamationService.getReclamations().subscribe(
      (data) => {
        this.reclamations = data;
        console.log(this.reclamations);
      },
      (error) => {
        console.error('Erreur lors de la récupération des réclamations :', error);
      }
    );
  }

  

  // Répondre à une réclamation
  respondToReclamation(reclamationId: number, responseText: string): void {
    if (!responseText || responseText.trim() === '') {
      alert('La réponse ne peut pas être vide.');
      return;
    }

    this.reclamationService.respondToReclamation(reclamationId, responseText).subscribe(
      (response) => {
        alert('Réponse envoyée avec succès.');
        this.loadReclamations(); // Recharger la liste des réclamations
      },
      (error) => {
        console.error('Erreur lors de l\'envoi de la réponse :', error);
      }
    );
  }

  // Fonction pour déclencher l'édition de la réponse
  editResponse(reclamation: any): void {
    this.selectedReclamationId = reclamation.id;
    this.newResponse = reclamation.reponse || ''; // Charge la réponse actuelle si elle existe
  }

  // Fonction pour annuler l'édition
  cancelEdit(): void {
    this.selectedReclamationId = null;
    this.newResponse = '';
  }

  // Fonction pour enregistrer la nouvelle réponse
  saveResponse(): void {
    if (this.newResponse.trim()) {
      this.reclamationService.updateReclamationResponse(this.selectedReclamationId!, this.newResponse)
        .subscribe(
          (response) => {
            // Si la réponse est sauvegardée, on réinitialise l'édition et on met à jour la liste
            this.cancelEdit();
            this.loadReclamations();  // Reload reclamations to show updated response
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la réponse', error);
            alert('Erreur lors de la mise à jour de la réponse');
          }
        );
    }
  }
  deleteReclamation(id: number): void {
    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => {
        // Supprimer l'appointment de la liste des appointments
        this.reclamations = this.reclamations.filter(reclamation => reclamation.id !== id);

        // Mettre à jour le statut du jour pour refléter la suppression
      },
      error: (err) => console.error('Erreur lors de la suppression', err)
    });
  }

}
