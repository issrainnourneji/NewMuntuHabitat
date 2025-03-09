import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDeleteConfirmationComponent } from '../../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../../Components/notification/notification.service';
import { DevisService } from '../../../services/services/devis.service';
import { Devis } from '../../../services/models/devis';

@Component({
  selector: 'app-all-devis',
  templateUrl: './all-devis.component.html',
  styleUrl: './all-devis.component.css'
})
export class AllDevisComponent implements OnInit {
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
    this.devisService.getDevis().subscribe(
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


}
