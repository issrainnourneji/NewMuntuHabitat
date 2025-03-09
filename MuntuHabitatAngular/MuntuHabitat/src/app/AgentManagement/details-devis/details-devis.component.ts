import { Component, OnInit, ViewChild } from '@angular/core';
import { Devis } from '../../services/models/devis';
import { DevisService } from '../../services/services/devis.service';
import { ModalDeleteConfirmationComponent } from '../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-details-devis',
  templateUrl: './details-devis.component.html',
  styleUrl: './details-devis.component.css'
})
export class DetailsDevisComponent implements OnInit {
  devis: any[] = [];
  loading: boolean = true;
  selectedDevis: Devis | null = null;
p:number=1;
idDevisToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
    params : any = {title : "Delete devis", content : "voulez vous vraiment supprimer le devis!"}

  constructor(private devisService: DevisService,private notifService : NotificationService) { }

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis(): void {
    this.devisService.getMyDevis().subscribe(
      (response) => {
        console.log('Réponse reçue :', response);
        if (response && response.devis && response.devis.length > 0) {
          this.devis = response.devis;
          this.loading = false;
        } else {
          console.error('Aucun devis trouvé');
          this.loading = false;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des devis', error);
        this.loading = false;
      }
    );
  }



  selectDevis(devis: any): void {
    if (this.selectedDevis === devis) {
      this.selectedDevis = null;
    } else {
      this.selectedDevis = devis;
    }
  }

  deleteDevis(){
    this.devisService.deleteDevis(this.idDevisToDelete).subscribe( () =>
    {
      this.loadDevis();
      this.modalDelete?.close();
      this.notifService.success('Le devis a été supprimé avec succès.')


    },  () => {
      this.notifService.error('Echec de supression car le devis est déja signé!')
      this.modalDelete?.close();

    });
  }
  confirmDelete(id : any) {
    this.idDevisToDelete = id ;
    this.modalDelete?.open();
      }
}
