import { Component, OnInit } from '@angular/core';
import { PrestationPrix } from '../../../services/models/prestationPrix';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PrestationPrixService } from '../../../services/services/prestationPrix.service';
import { Lot } from '../../../services/models/lot';
import { Unite } from '../../../services/models/unite';

@Component({
  selector: 'app-update-prestation',
  templateUrl: './update-prestation.component.html',
  styleUrl: './update-prestation.component.css'
})
export class UpdatePrestationComponent implements OnInit {
  myId=0;
  myPrestation!:PrestationPrix;
  reactiveForm=this.fb.group(
    {
    id:[0],
    designation: [''],
    lot: [''],
    prixFourniture: [0],
    prixUnitaire: [0],
    unite: ['']
    }
  );
  constructor(private AR:ActivatedRoute,private fb:FormBuilder, private R:Router, private prixService:PrestationPrixService ) { }

  ngOnInit(): void {
    this.prixService.getPrestationById(this.AR.snapshot.params["id"]).subscribe(data => {
      this.myPrestation = data;

      this.reactiveForm.patchValue({
        id: this.myPrestation.id,
        designation: this.myPrestation.designation,
        lot: this.myPrestation.lot,
        prixFourniture: this.myPrestation.prixFourniture,
        prixUnitaire: this.myPrestation.prixUnitaire,
        unite: this.myPrestation.unite
      });
    });
  }

  update(): void {
    const updatedPrestation: PrestationPrix = {
      ...this.myPrestation,
      id: this.reactiveForm.value.id || 0,
      designation: this.reactiveForm.value.designation || '',
      lot: this.reactiveForm.value.lot as Lot || '',
      prixFourniture: Number(this.reactiveForm.value.prixFourniture) || 0,
      prixUnitaire: Number(this.reactiveForm.value.prixUnitaire) || 0,
      unite: this.reactiveForm.value.unite as Unite || '',
    };

    this.prixService.UpdatePrestation(updatedPrestation).subscribe(() => {
      this.R.navigate(['agentHome/Listprix']);
    });
  }



  get id(){
    return this.reactiveForm.get('id')
  }
  get designation(){
    return this.reactiveForm.get('designation');

  }
  get lot(){
    return this.reactiveForm.get('lot')
  }
  get prixFourniture(){
    return this.reactiveForm.get('prixFourniture');

  }
  get prixUnitaire(){
    return this.reactiveForm.get('prixUnitaire')
  }
  get unite(){
    return this.reactiveForm.get('unite')
  }

}
