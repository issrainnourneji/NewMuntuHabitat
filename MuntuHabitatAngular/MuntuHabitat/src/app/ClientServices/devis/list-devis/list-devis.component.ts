import { Component, OnInit, ViewChild } from '@angular/core';
import { DevisService } from '../../../services/services/devis.service';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Devis } from '../../../services/models/devis';
import { ModalDeleteConfirmationComponent } from '../../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../../Components/notification/notification.service';


@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrl: './list-devis.component.css'
})
export class ListDevisComponent implements OnInit {
  userId: number | null = null;
  deviss: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  signature: string | null = null;
  selectedDevis: Devis | null = null;
  userDetails: any = null;
  agentDetails: any = null;
idDevisToSign : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Signer le devis", content : "voulez vous vraiment signer le devis!"}

  constructor(private devisservice: DevisService , private notifService:NotificationService) {}

  ngOnInit(): void {
    this.userId = this.devisservice.getUserId();
    if (this.userId === null) {
      this.error = 'ID utilisateur non trouvé dans le token.';
      this.isLoading = false;
      return;
    }
    this.loadUserData();
  }

  loadUserData(): void {
    if (this.userId === null) {
      this.error = "ID utilisateur est invalide.";
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.devisservice.getMyuserDevis().subscribe({
      next: (data) => {
        this.userDetails = data.user;
        this.deviss = data.deviss.map((devis: any) => ({
          ...devis,
          isSigned: localStorage.getItem(`devis_${devis.id}_signed`) === 'true' || devis.isSigned
      }));
        this.agentDetails = data.agent;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des données:", err);
        this.error = "Aucun devis est disponible maintenant.";
        this.isLoading = false;
      }
    });
  }
  selectDevis(devis: any): void {
    if (this.selectedDevis === devis) {
      this.selectedDevis = null;
    } else {
      this.selectedDevis = devis;
    }
  }

  addSignature(): void {
    this.devisservice.signDevis(this.idDevisToSign).subscribe({
        next: () => {
            this.deviss = this.deviss.map((devis: any) => {
                if (devis.id === this.idDevisToSign) {
                  devis.isSigned = true;
                    localStorage.setItem(`devis_${this.idDevisToSign}_signed`, 'true');
                }
                return devis;
            });
            this.signature = 'Devis signé avec succès!';
            this.modalDelete?.close();
            this.loadUserData()
      this.notifService.success('Le devis a été signé avec succès.')
        },
        error: (err) => {
            console.error("Erreur lors de la signature:", err);
            this.signature = 'Erreur lors de la signature du devis.';
            this.notifService.error('Echec de la signature')
            this.modalDelete?.close();
        }
    });
}
confirmDelete(id : any) {
  this.idDevisToSign = id ;
  this.modalDelete?.open();
    }
  downloadDevisPDF(devis: any): void {
    const devisContent = document.getElementById('devis-content-' + devis.devisId);

    if (devisContent) {
      // Utiliser html2canvas pour capturer l'élément HTML sous forme d'image
      html2canvas(devisContent).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();

        // Ajouter l'image capturée au PDF
        doc.addImage(imgData, 'PNG', 10, 10, 180, 250);  // Ajustez la taille et la position de l'image selon vos besoins
        doc.save('devis_' + devis.devisId + '.pdf');
      });
    }
  }

}
