import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContractService } from '../../services/services/contrat.service';
import { ActivatedRoute } from '@angular/router';
import { Contrat } from '../../services/models/contrat';
import { ModalDeleteConfirmationComponent } from '../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-list-contrat',
  templateUrl: './list-contrat.component.html',
  styleUrl: './list-contrat.component.css'
})
export class ListContratComponent implements OnInit {
  contrats: any[] = [];
  loading: boolean = true; // Initialiser à true pour afficher "Chargement..."
  selectedContrat: Contrat | null = null; // Variable pour stocker le contrat sélectionné
  userDetails: any = null;
  p: number = 1;
  idContratToDelete : number = 0
    @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
      params : any = {title : "Delete contrat", content : "voulez vous vraiment supprimer le contrat!"}

  constructor(private contratService: ContractService, private notifService : NotificationService) { }

  ngOnInit(): void {

    this.loadContrats();
  }

  loadContrats(): void {
    this.contratService.getMyContrats().subscribe(
      (response) => {
        console.log('Réponse reçue :', response); // Assurez-vous que response contient bien 'contrats'
        if (response && response.contrats && response.contrats.length > 0) {
          this.contrats = response.contrats;
          this.loading = false;
        } else {
          console.error('Aucun contrat trouvé');
          this.loading = false;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des contrats', error);
        this.loading = false;
      }
    );
  }



  // Sélectionner un contrat pour afficher les détails
  selectContrat(contrat: any): void {
    if (this.selectedContrat === contrat) {
      this.selectedContrat = null;  // Si le contrat est déjà sélectionné, désélectionnez-le
    } else {
      this.selectedContrat = contrat;  // Sélectionnez le contrat
    }
  }

  deleteContrat(){
    this.contratService.deleteContrat(this.idContratToDelete).subscribe( () =>
    {
      this.loadContrats();
      this.modalDelete?.close();
      this.notifService.success('Le contrat a été supprimé avec succès.')


    },  () => {
      this.notifService.error('Echec de supression car le contrat est déja signé!')
      this.modalDelete?.close();

    });
  }
  confirmDelete(id : any) {
    this.idContratToDelete = id ;
    this.modalDelete?.open();
      }
}
