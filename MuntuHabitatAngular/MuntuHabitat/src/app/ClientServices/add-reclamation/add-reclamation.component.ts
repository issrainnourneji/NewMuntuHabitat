import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamationService } from '../../services/services/reclamation.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrl: './add-reclamation.component.css'
})
export class AddReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  reclamations: any[] = [];
  p:number=1
  constructor(private fb: FormBuilder, private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.reclamationForm = this.fb.group({
      objet: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.loadReclamations();
  }

  // Charger les réclamations assignées à l'agent
  loadReclamations(): void {
    this.reclamationService.getReclamations().subscribe(
      (data) => {
        this.reclamations = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réclamations :', error);
      }
    );
  }

  submitReclamation(): void {
    if (this.reclamationForm.valid) {
      const reclamation = this.reclamationForm.value;

      this.reclamationService.createReclamation(reclamation).subscribe({
        next: (response) => {
          this.showSuccessModal();
                    this.reclamationForm.reset();
                    this.loadReclamations();
        },
        error: (error) => {
          alert('Erreur lors de l\'envoi de la réclamation');
          console.error(error);
        },
      });
    }
  }
  showSuccessModal(): void {
    // Ouvrir le modal
    const modalElement = document.getElementById('reclamationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


}
