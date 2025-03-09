import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facture, FactureDTO, SelectedPrestation } from '../../services/models/facture';
import { FactureService } from '../../services/services/facture.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TokenService } from '../../services/token/token.service';
import { PrestationPrix } from '../../services/models/prestationPrix';
import { PrestationPrixService } from '../../services/services/prestationPrix.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrl: './add-facture.component.css'
})
export class AddFactureComponent implements OnInit {
  users: any[] = [];
  prestations: PrestationPrix[] = [];
  selectedPrestations: Map<number, SelectedPrestation> = new Map();
  userId: number | null = null;
  agentId: number | null = null;
  selectedPrestation: SelectedPrestation[] = [];
 p: number =1
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: TokenService,
    private factureService: FactureService,
    private prestationService: PrestationPrixService,
    private notifService : NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getUsersAndAgents().subscribe(
      (response) => {
        if (response.users) {
          this.users = response.users;
        }
      },
      (error) => {
        console.error('Error retrieving data', error);
      }
    );
    this.loadPrestations();
    this.extractAgentIdFromToken();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private extractAgentIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token JWT manquant dans localStorage.');
      return;
    }

    try {
      const decodedToken = this.decodeToken(token);
      this.agentId = decodedToken.userId || null; // Remplacez userId par la bonne clé dans le token
      if (!this.agentId) {
        console.error('Agent ID introuvable dans le token.');
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // Extraire la partie Payload
      const decodedPayload = atob(payload); // Décoder en base64
      return JSON.parse(decodedPayload); // Convertir en objet JSON
    } catch (error) {
      throw new Error('Erreur lors du décodage du token : ' + error);
    }
  }
  loadPrestations(): void {
    this.prestationService.getData().subscribe({
      next: (data) => {
        this.prestations = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des prestations :', err);
      }
    });
  }

  togglePrestation(prestation: PrestationPrix): void {
    if (this.selectedPrestations.has(prestation.id!)) {
      this.selectedPrestations.delete(prestation.id!);
    } else {
      this.selectedPrestations.set(prestation.id!, {
        prestation,
        quantite: 1,
        montantTotal: this.calculateMontantTotal(prestation.prixUnitaire, 1)
      });
    }
  }

  updateQuantite(prestationId: number, quantiteStr: string): void {
    const quantite = parseFloat(quantiteStr);
    if (isNaN(quantite) || quantite < 1) return;

    const selectedPrestation = this.selectedPrestations.get(prestationId);
    if (selectedPrestation) {
      const prestation = selectedPrestation.prestation;
      this.selectedPrestations.set(prestationId, {
        prestation,
        quantite,
        montantTotal: this.calculateMontantTotal(prestation.prixUnitaire, quantite)
      });
    }
  }

  private calculateMontantTotal(prixUnitaire: number, quantite: number): number {
    return parseFloat((prixUnitaire * quantite).toFixed(2));
  }

  getTotalGeneral(): number {
    return Array.from(this.selectedPrestations.values())
        .reduce((total, item) => total + item.montantTotal, 0);
}


  isFormValid(): boolean {
    return !!(
      this.userId &&
      this.agentId &&
      this.selectedPrestations.size > 0 &&
      !this.loading
    );
  }

  createFacture(): void {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
  }

    const factureDTO: FactureDTO = {
      userId: this.userId!,
      agentId: this.agentId!,
      prestations: Array.from(this.selectedPrestations.values()).map(item => ({
        prestationId: item.prestation.id!,
        quantite: item.quantite,
        montantTotal: item.montantTotal,
      })),
    };
    this.loading = true;
    this.factureService.createFacture(factureDTO).subscribe({
      next: () => {
          this.reset();
          console.log('Facture envoyée au backend :', factureDTO);
          this.notifService.success('la création est effectué avec succès')

      },
      error: (err) => {
        console.error('Erreur lors de la création de la facture :', err);
        alert(`Erreur lors de la création de la facture : ${err.message || 'Vérifiez les logs serveur.'}`);
      },
      complete: () => {
          this.loading = false;
      }
  });
  }

  reset(): void {
    this.selectedPrestations.clear();
    this.userId = null;
  }
}
