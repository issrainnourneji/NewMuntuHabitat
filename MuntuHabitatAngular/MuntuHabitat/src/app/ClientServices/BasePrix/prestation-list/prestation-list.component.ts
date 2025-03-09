import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { PrestationPrix } from '../../../services/models/prestationPrix';
import { PrestationPrixService } from '../../../services/services/prestationPrix.service';
import { Route, Router } from '@angular/router';
import { ModalDeleteConfirmationComponent } from '../../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../../Components/notification/notification.service';

@Component({
  selector: 'app-prestation-list',
  templateUrl: './prestation-list.component.html',
  styleUrl: './prestation-list.component.css'
})
export class PrestationListComponent implements OnInit {
  list:PrestationPrix[]=[]
  p: number = 1;
  idPrestationToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Delete prestation", content : "voulez vous vraiment supprimer la prestation!"}
  constructor(private prixService : PrestationPrixService,private notifService : NotificationService, private router : Router) { }

  ngOnInit(): void {
    this.getListPrix();
   console.log(this.list)
  }
  getListPrix(){
    this.prixService.getData().subscribe(
      data=>{this.list=data;
      console.log(this.list);

    }
    )

  }
  DeletePrestation(){
    this.prixService.deletePrestation(this.idPrestationToDelete).subscribe( () =>
    {
      this.getListPrix();
      this.modalDelete?.close();
      this.notifService.success('La prestation a été supprimé avec succès.')


    },  () => {
      this.notifService.error('Echec de supression! Cette prestation est lié à un devis.')
      this.modalDelete?.close();

    });
  }
  confirmDelete(id : any) {
    this.idPrestationToDelete = id ;
    this.modalDelete?.open();
      }

  ajouterPrestation(){
    this.router.navigate(['agentHome/addprestation']);
  }
  onEditPrestation(id: any) {
    this.router.navigate([`/agentHome/Listprix/update`, id]);
  }


}
