import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { DevisService } from '../../services/services/devis.service';
import { DevisDTO, Standing } from '../../services/models/devis';
import { PrestationPrix } from '../../services/models/prestationPrix';
import { SelectedPrestation } from '../../services/models/facture';
import { PrestationPrixService } from '../../services/services/prestationPrix.service';
import { Subject } from 'rxjs';
import { TypeSimulation } from '../../services/models';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrl: './add-devis.component.css'
})
export class AddDevisComponent implements OnInit {
  users: any[] = [];
  devisDTO: DevisDTO = {
    userId: 0,    // Valeur par défaut, vous pouvez la modifier en fonction de votre logique
    agentId: 0,   // Valeur par défaut
    prestations: [],  // Liste vide ou valeurs par défaut
    objet: '',
    adresse: '',
    standing: 'MOYEN' as Standing,  // Valeur par défaut valide pour l'enum Standing
  type: 'Rénovation' as TypeSimulation,
  dateDebut: '',
  duree: 0
  };
  agent: any;
  prestations: PrestationPrix[] = [];
  selectedPrestations: Map<number, SelectedPrestation> = new Map();
  userId: number | null = null;
  agentId: number | null = null;
  selectedPrestation: SelectedPrestation[] = [];
  p: number =1
  todayDate: string = new Date().toISOString().split('T')[0];

  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: TokenService,
    private devisService: DevisService,
    private prestationService : PrestationPrixService,
    private notifService : NotificationService

  ) {}

  ngOnInit(): void {
    this.userService.getUsersAndAgents().subscribe(
      (response) => {
        if (response.users) {
          this.users = response.users;
        } else if (response.user) {
          this.agent = response.user;
        }
      },
      (error) => {
        console.error('Error retrieving data', error);
      }
    );
    this.loadPrestations();

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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createDevis(): void {
    if (!this.isFormValid()) {
      this.notifService.warn('Veuillez remplir tous les champs requis.')
      return;
  }
    const devisDTO: DevisDTO = {
      userId: this.userId!,
      agentId: this.agentId!,
      prestations: Array.from(this.selectedPrestations.values()).map(item => ({
        prestationId: item.prestation.id!,
        quantite: item.quantite,
        montantTotal: item.montantTotal,
      })),
      objet: this.devisDTO.objet,
      adresse: this.devisDTO.adresse,
      standing: this.devisDTO.standing,
      type: this.devisDTO.type,
      dateDebut: this.devisDTO.dateDebut,
      duree: this.devisDTO.duree,
    };
    this.loading = true;
    this.devisService.createDevis(devisDTO).subscribe({
      next: () => {
        this.notifService.success('la création est effectué avec succès')
        this.reset();
          console.log('Devis envoyée au backend :', devisDTO);

      },
      error: (err) => {
        console.error('Erreur lors de la création de la devis :', err);
        this.notifService.error(`Erreur lors de la création de la devis : ${err.message || 'Vérifiez les logs serveur.'}`);
      },
      complete: () => {
          this.loading = false;
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

reset(): void {
  this.selectedPrestations.clear();
  this.userId = null;
}

isFormValid(): boolean {
  return !!(
    this.userId &&
    this.devisDTO.objet.trim() &&
    this.devisDTO.adresse.trim() &&
    this.devisDTO.standing &&
    this.devisDTO.type &&
    this.selectedPrestations.size > 0 &&
    !this.loading
  );
}

}
