import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../../services/token/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  message: string | null = null;

  constructor(
    private readonly apiService: TokenService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }




  async handleSubmit() {
    if (this.registerForm.invalid) {
      this.showMessage("Veuillez remplir correctement tous les champs.");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.registerUser(this.registerForm.value));
      if (response.status === 200) {
        this.showMessage('Utilisateur enregistré avec succès');
        this.router.navigate(['activate-account']);
      }
    } catch (error: any) {
      console.log(error);
      this.showMessage(error.error?.message || error.message || 'Impossible de s’enregistrer');
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = null), 3000);
  }
}

