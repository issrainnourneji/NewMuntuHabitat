import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaiementService } from '../../services/services/paiement.service';



@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent {
  paiementForm: FormGroup;
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService
  ) {
    this.paiementForm = this.fb.group({
      methodePaiement: ['', Validators.required],
      referenceTransaction: ['', Validators.required]
    });
  }

  effectuerPaiement() {
  /*  if (this.paiementForm.valid) {
      this.loading = true;
      this.error = '';

      const { methodePaiement, referenceTransaction } = this.paiementForm.value;

      this.paiementService.effectuerPaiement(
        this.facture.id,
        methodePaiement,
        referenceTransaction
      ).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du paiement. Veuillez réessayer.';
          this.loading = false;
        }
      });
    }*/
  }
}
