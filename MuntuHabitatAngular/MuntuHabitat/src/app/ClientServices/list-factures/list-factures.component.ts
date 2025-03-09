import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../services/services/facture.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Facture } from '../../services/models/facture';

@Component({
  selector: 'app-list-factures',
  templateUrl: './list-factures.component.html',
  styleUrls: ['./list-factures.component.css']
})
export class ListFacturesComponent implements OnInit {
  userId: number | null = null;
  userDetails: any = null;
  factures: any[] = [];
  agentDetails: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  signature: string | null = null;
  selectedFacture: Facture | null = null;
p : number = 1

  constructor(private factureService: FactureService) {}

  ngOnInit(): void {
    this.userId = this.factureService.getUserId();
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
    this.factureService.getMyuserFacture().subscribe({
      next: (data) => {
        this.userDetails = data.user;
        this.factures = data.factures.map((facture: any) => ({
          ...facture,
          isSigned: localStorage.getItem(`facture_${facture.id}_signed`) === 'true' || facture.isSigned
      }));
        this.agentDetails = data.agent;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des données:", err);
        this.error = "Aucun facture est disponible maintenant.";
        this.isLoading = false;
      }
    });
  }
  selectFacture(facture: any): void {
    if (this.selectedFacture === facture) {
      this.selectedFacture = null;
    } else {
      this.selectedFacture = facture;
    }
  }

  downloadFacturePDF(facture: any): void {
    // Sélectionner l'élément HTML contenant les détails de la facture
    const factureContent = document.getElementById('facture-content-' + facture.factureId);

    if (factureContent) {
      // Utiliser html2canvas pour capturer l'élément HTML sous forme d'image
      html2canvas(factureContent).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();

        // Ajouter l'image capturée au PDF
        doc.addImage(imgData, 'PNG', 10, 10, 180, 250);  // Ajustez la taille et la position de l'image selon vos besoins
        doc.save('facture_' + facture.factureId + '.pdf');
      });
    }
  }

}
