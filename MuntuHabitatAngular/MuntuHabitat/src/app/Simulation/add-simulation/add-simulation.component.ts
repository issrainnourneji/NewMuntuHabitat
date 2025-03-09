import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimulationControllerService } from '../../services/services';
import { Question } from '../../services/models';
import { TypeSimulation } from '../../services/models/type-simulation';
import { NotificationService } from '../../Components/notification/notification.service';

@Component({
  selector: 'app-add-simulation',
  templateUrl: './add-simulation.component.html',
  styleUrls: ['./add-simulation.component.css']
})
export class AddSimulationComponent implements OnInit {
  addSimulationForm: FormGroup;
  simulationTypes = Object.values(TypeSimulation);

  constructor(private fb: FormBuilder, private simulationService: SimulationControllerService, private notifService : NotificationService) {
    this.addSimulationForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addQuestion();
  }

  get questions(): FormArray {
    return this.addSimulationForm.get('questions') as FormArray;
  }

  categories(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('categories') as FormArray;
  }

  addQuestion(): void {
    const questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      categories: this.fb.array([])
    });
    this.questions.push(questionForm);
    this.addCategory(this.questions.length - 1);
  }

  addCategory(questionIndex: number): void {
    const categories = this.categories(questionIndex);
    const categoryForm = this.fb.group({
      content: ['', Validators.required],
      price: [0],
      title: ['', Validators.required],
      imageUrl: [''],
      description: [''],
      descriptionTitle: ['']
    });
    categories.push(categoryForm);
  }
  onFileChange(event: any, questionIndex: number, categoryIndex: number): void {
    const file = event.target.files[0];  // Récupère le fichier sélectionné

    // Vérifie si un fichier a bien été sélectionné
    if (file) {
      // Crée un objet FormData pour envoyer l'image
      const formData = new FormData();
      formData.append('image', file, file.name); // Ajoute le fichier au FormData

      // Vous pouvez ici envoyer formData à un service backend si nécessaire
      // Par exemple, si vous avez un service d'upload d'image, vous pouvez l'utiliser pour télécharger l'image sur le serveur

      // Mise à jour du champ imageUrl dans le formulaire avec le nom du fichier
      // Vous pouvez aussi lier l'image à une URL relative comme assets/formulaire/
      const imageUrl = `../../../assets/formulaire/${file.name}`;
      this.categories(questionIndex).at(categoryIndex).patchValue({
        imageUrl: imageUrl // Mettez à jour le champ imageUrl du formulaire
      });

      // Si vous voulez afficher l'image localement sans avoir besoin de la télécharger sur le serveur,
      // vous pouvez utiliser un URL basé sur FileReader ou Data URL.
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Si vous voulez afficher l'image immédiatement après le téléchargement
        this.categories(questionIndex).at(categoryIndex).patchValue({
          imagePreview: e.target.result // Stocke l'image prévisualisée en base64
        });
      };
      reader.readAsDataURL(file); // Lis l'image en tant que Data URL
    }
  }


  onSubmit(): void {
    if (this.addSimulationForm.valid) {
      this.addSimulationForm.value.questions.forEach((q: any) => {
        const question: Question = {
          text: q.text,
          type: q.type,
          categories: q.categories.map((c: any) => ({
            content: c.content,
            price: c.price,
            title: c.title,
            imageUrl: c.imageUrl,
            description: c.description,
            descriptionTitle: c.descriptionTitle
          }))
        };

        this.simulationService.AddQuestion(question).subscribe(data => {
          console.log('Question added', data);
          this.notifService.success('Simulation addded')
        });
      });
    } else {
      console.log('Form is invalid');
      this.notifService.error('you are a problem!')
    }
  }
}
