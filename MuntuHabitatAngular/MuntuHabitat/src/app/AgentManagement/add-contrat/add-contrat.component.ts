import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../../services/services/contrat.service';
import { TokenService } from '../../services/token/token.service';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../Components/notification/notification.service';


@Component({
  selector: 'app-add-contrat',
  templateUrl: './add-contrat.component.html',
  styleUrl: './add-contrat.component.css'
})
export class AddContratComponent implements OnInit {
  users: any[] = [];
  userId!: number;
  agent: any;

  @ViewChild('successModal') successModal: any;

  constructor(
    private userService: TokenService,
    private contratService: ContractService,
        private notifService : NotificationService

  ) {}

  ngOnInit(): void {
    this.userService.getUsersAndAgents().subscribe(
      (response) => {
        if (response.users) {
          this.users = response.users; // Filtrer les utilisateurs affectés à l'agent dans la méthode getUsersAndAgents
        } else if (response.user) {
          this.agent = response.user;
        }
      },
      (error) => {
        console.error('Error retrieving data', error);
      }
    );
  }


  createContrat(): void {
    if (!this.userId) {
      console.error('Aucun utilisateur sélectionné');
      this.notifService.error('Aucun utilisateur sélectionné')
      return;
    }

    // Appel du service pour créer un contrat
    this.contratService.createContrat(this.userId).subscribe(
      (response) => {
        console.log('Contrat créé avec succès', response);
        this.showSuccessModal();

        // Rediriger ou afficher un message de succès
      },
      (error) => {
        console.error('Erreur lors de la création du contrat', error);
      }
    );
  }

  showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal')!);
    modal.show();
  }

}
