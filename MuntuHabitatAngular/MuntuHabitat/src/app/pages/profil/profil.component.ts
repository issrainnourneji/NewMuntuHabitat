import { Component, OnInit, ElementRef } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userInfo: any = null;
  error: any = null;
  isEditing: boolean = false;
  editForm: any = {};

  constructor(
    private apiService: TokenService,
    private router: Router,
    private elementRef: ElementRef // Pour manipuler le DOM
  ) {}

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  fetchUserInfo(): void {
    this.apiService.getLoggedInUserInfo().subscribe({
      next: (response) => {
        this.userInfo = response.user;
        this.editForm = { ...this.userInfo };
      },
      error: (error) => {
        console.log(error);
        this.error = error?.error?.message || 'Unable to fetch user information';
      }
    });
  }

  editProfile(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm = { ...this.userInfo };
  }

  updateProfile(): void {
    this.apiService.UpdateUser(this.editForm).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.fetchUserInfo(); // Recharger les informations utilisateur

        // Afficher la modal
        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error(error);
        this.error = error?.error?.message || 'Unable to update profile';
      },
    });
  }
}
