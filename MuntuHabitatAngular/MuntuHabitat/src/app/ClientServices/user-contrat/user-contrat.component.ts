import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractService } from '../../services/services/contrat.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ModalDeleteConfirmationComponent } from '../../Components/modal/modal-delete-confirmation.component';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-user-contrat',
  templateUrl: './user-contrat.component.html',
  styleUrls: ['./user-contrat.component.css']
})
export class UserContratComponent implements OnInit {
  userId: number | null = null;
  userDetails: any = null;
  contrats: any[] = [];
  agentDetails: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  signature: string | null = null;
idContratToSign : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Signer le contrat", content : "voulez vous vraiment signer le contrat!"}

  constructor(private contractService: ContractService, private notifService:NotificationService) {}

  ngOnInit(): void {
    this.userId = this.contractService.getUserId();
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
    this.contractService.getContratsByUser(this.userId).subscribe({
      next: (data) => {
        this.userDetails = data.user;
        this.contrats = data.contrats.map((contrat: any) => ({
          ...contrat,
          isSigned: localStorage.getItem(`contrat_${contrat.id}_signed`) === 'true' || contrat.isSigned
      }));
        this.agentDetails = data.agent;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des données:", err);
        this.error = "Aucun contrat est disponible maintenant.";
        this.isLoading = false;
      }
    });
  }

  addSignature(): void {
    this.contractService.signContrat(this.idContratToSign).subscribe({
        next: () => {
            this.contrats = this.contrats.map((contrat: any) => {
                if (contrat.id === this.idContratToSign) {
                    contrat.isSigned = true;
                    localStorage.setItem(`contrat_${this.idContratToSign}_signed`, 'true');
                }
                return contrat;
            });
            this.signature = 'Contrat signé avec succès!';
            this.modalDelete?.close();
      this.notifService.success('Le contrat a été signé avec succès.')
        },
        error: (err) => {
            console.error("Erreur lors de la signature:", err);
            this.signature = 'Erreur lors de la signature du contrat.';
            this.notifService.error('Echec de la signature')
            this.modalDelete?.close();
        }
    });
}
confirmDelete(id : any) {
  this.idContratToSign = id ;
  this.modalDelete?.open();
    }

  downloadAllPdf(): void {
    const pdf = new jsPDF('p', 'mm', 'a4'); // PDF format A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let promises: Promise<void>[] = [];

    this.contrats.forEach((contrat, index) => {
      const contratElement = document.getElementById(`contrat-${contrat.id}`);
      if (contratElement) {
        const promise = html2canvas(contratElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pdfWidth - 20; // Margins on the sides
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (index !== 0) {
            pdf.addPage(); // Add a new page for every contrat except the first
          }

          const yPosition = 10; // Top margin
          pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, Math.min(imgHeight, pdfHeight - 20));
        });

        promises.push(promise);
      }
    });

    Promise.all(promises).then(() => {
      pdf.save('tous_les_contrats.pdf');
    });
  }


}
