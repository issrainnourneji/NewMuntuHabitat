import { Component } from '@angular/core';
import { TokenService } from '../../../services/token/token.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(private fb: FormBuilder, private resetService: TokenService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.resetService.requestPasswordReset(this.resetForm.value.email)
        .subscribe({
          next: (res) => this.message = 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
          error: (err) => this.error = 'Erreur lors de l\'envoi de l\'e-mail. Veuillez réessayer.'
        });
    }
  }
}

