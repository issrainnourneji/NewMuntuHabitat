import { Component, OnInit, ViewChild } from '@angular/core';
import { Facture } from '../../services/models/facture';
import { FactureService } from '../../services/services/facture.service';
import { ModalDeleteConfirmationComponent } from '../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-details-facture',
  templateUrl: './details-facture.component.html',
  styleUrl: './details-facture.component.css'
})
export class DetailsFactureComponent implements OnInit {
  factures: any[] = [];
  loading: boolean = true;
  selectedFacture: Facture | null = null;
  p: number = 1;
  idFactureToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
    params : any = {title : "Delete facture", content : "voulez vous vraiment supprimer la facture!"}

  constructor(private factureService: FactureService ,private notifService : NotificationService) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.factureService.getMyFacture().subscribe(
      (data: any) => {
        this.factures = data.factures;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des factures', error);
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

  deleteFacture(){
    this.factureService.deleteFacture(this.idFactureToDelete).subscribe( () =>
    {
      this.loadFactures();
      this.modalDelete?.close();
      this.notifService.success('La facture a été supprimé avec succès.')


    },  () => {
      this.notifService.error('Echec de supression!')
      this.modalDelete?.close();

    });
  }
  confirmDelete(id : any) {
    this.idFactureToDelete = id ;
    this.modalDelete?.open();
      }
}
