import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent implements OnInit {
  item: any;
  prospectForm: FormGroup;
  step2Form: FormGroup;
  formData: any = {
    email: '',
    name: '',
    phoneNumber: '',
    address: '',
    password: '123456789',
    prospectSelection: {
      role: '',
      propertyType: '',
      workType: '',
      budget: ''
    }
  };
  message: string | null = null;
  currentStep: number = 1;

  // Mapping des rôles
   roles: { [key: string]: string } = {
    '1': 'Propriétaire particulier',
    '2': 'Futur acquéreur',
    '3': 'Professionnel',
  };

 propertyTypes: { [key: string]: string } = {
  '1': 'Maison',
  '2': 'Appartement',
  '3': 'Immeuble',
};

 workTypes: { [key: string]: string } = {
  '1': 'Rénovation',
  '2': 'Extension',
  '3': 'Construction',
};

 budgets: { [key: string]: string } = {
  '1': 'Moins de 20000 €',
  '2': 'De 20000 € à 50000 €',
  '3': 'De 50000 € à 100000 €',
  '4': 'Plus de 100000 €',
};

getRoleText(roleId: string): string {
  return this.roles[roleId] || 'Inconnu';
}

getPropertyTypeText(propertyTypeId: string): string {
  return this.propertyTypes[propertyTypeId] || 'Inconnu';
}

getWorkTypeText(workTypeId: string): string {
  return this.workTypes[workTypeId] || 'Inconnu';
}

getBudgetText(budgetId: string): string {
  return this.budgets[budgetId] || 'Inconnu';
}


  constructor(
    private fb: FormBuilder,
    private apiService: TokenService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.prospectForm  = this.fb.group({
      prospectSelection: this.fb.group({
        role: ['', Validators.required],
        propertyType: ['', Validators.required],
        workType: ['', Validators.required],
        budget: ['', Validators.required]
      })
    });

    this.step2Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:8080/simulation/getC/${id}`).subscribe(data => {
      this.item = data;
    });
  }

  nextStep() {
    if (this.prospectForm.valid) {
      const role = this.getRoleText(this.prospectForm.value.prospectSelection.role);
      const propertyType = this.getPropertyTypeText(this.prospectForm.value.prospectSelection.propertyType);
      const workType = this.getWorkTypeText(this.prospectForm.value.prospectSelection.workType);
      const budget = this.getBudgetText(this.prospectForm.value.prospectSelection.budget);

      this.formData = {
        ...this.formData,
        ...this.prospectForm.value,
        prospectSelection: {
          ...this.prospectForm.value.prospectSelection,
          role,
          propertyType,
          workType,
          budget
        }
      };

      this.currentStep = 2;
    } else {
      this.showMessage("Veuillez remplir tous les champs obligatoires dans l'étape 1.");
    }
  }



async onSubmit() {
  if (this.step2Form.invalid) {
      this.showMessage("Tous les champs sont obligatoires dans l'étape 2.");
      return;
  }

  const formValues = this.step2Form.value;
  if (!formValues.email || !formValues.name || !formValues.phoneNumber || !formValues.address) {
      this.showMessage("Tous les champs sont obligatoires dans l'étape 2.");
      return;
  }

  this.formData = {
      ...this.formData,
      ...formValues
  };

  try {
      const response: any = await firstValueFrom(this.apiService.registerProspect(this.formData));
      if (response.status === 200) {
          this.showMessage('Utilisateur ajouté avec succès');
      }
  } catch (error: any) {
      console.log(error);
      this.showMessage(error.error?.message || error.message || 'Échec de l\'inscription');
  }
}

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
}
