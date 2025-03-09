import { Component, OnInit } from '@angular/core';
import { PrestationPrix } from '../../../services/models/prestationPrix';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrestationPrixService } from '../../../services/services/prestationPrix.service';
import { Lot } from '../../../services/models/lot';
import { Unite } from '../../../services/models/unite';

@Component({
  selector: 'app-add-prestation',
  templateUrl: './add-prestation.component.html',
  styleUrl: './add-prestation.component.css'
})
export class AddPrestationComponent implements OnInit {
  prix!: PrestationPrix[];
  lots = Object.values(Lot);
  unites = Object.values(Unite);

  constructor(private fb: FormBuilder, private router: Router, private prixService: PrestationPrixService) { }

  ngOnInit(): void {
  }

  reactiveForm = this.fb.group({
    designation: ['', [Validators.required]],
    lot: ['', [Validators.required]],
    prixFourniture: ['', [Validators.required]],
    prixUnitaire: ['', [Validators.required]],
    unite: ['', [Validators.required]]
  });

  add() {
    if (this.reactiveForm.valid) {
      const newPrestation: PrestationPrix = {
        id: undefined,
        designation: this.reactiveForm.value.designation || '',
        lot: this.reactiveForm.value.lot as Lot,
        prixFourniture: Number(this.reactiveForm.value.prixFourniture) || 0,
        prixUnitaire: Number(this.reactiveForm.value.prixUnitaire) || 0,
        unite: this.reactiveForm.value.unite as Unite,
      };

      this.prixService.addPrestation(newPrestation).subscribe(data => {
        console.log('Prestation ajoutée avec succès', data);
        this.router.navigate(['agentHome/Listprix']);
      });
    } else {
      console.error('Le formulaire est invalide');
    }
  }

  get designation() {
    return this.reactiveForm.get('designation');
  }

  get lot() {
    return this.reactiveForm.get('lot');
  }

  get prixFourniture() {
    return this.reactiveForm.get('prixFourniture');
  }

  get prixUnitaire() {
    return this.reactiveForm.get('prixUnitaire');
  }

  get unite() {
    return this.reactiveForm.get('unite');
  }
}
