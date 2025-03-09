import { Component, OnInit } from '@angular/core';
import { Question, Categorie } from '../../services/models';
import { SimulationControllerService } from '../../services/services';

@Component({
  selector: 'app-list-smulation',
  templateUrl: './list-smulation.component.html',
  styleUrls: ['./list-smulation.component.css']
})
export class ListSmulationComponent implements OnInit {
  questions: Question[] = [];
  editingQuestion: any | null = null;
  editingCategory: any | null = null;
p:number=1
  constructor(private simulationService: SimulationControllerService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.simulationService.getData().subscribe((data: Question[]) => {
      this.questions = data;
    });
  }

  editQuestion(question: Question): void {
    this.editingQuestion = { ...question }; // Crée une copie pour modification
  }

  saveQuestion(): void {
    if (this.editingQuestion) {
      this.simulationService.UpdateQuestion(this.editingQuestion).subscribe(() => {
        this.questions = this.questions.map((q) =>
          q.id === this.editingQuestion!.id ? this.editingQuestion! : q
        );
        this.editingQuestion = null;
        alert('Question mise à jour avec succès');
      });
    }
  }

  cancelEdit(): void {
    this.editingQuestion = null;
  }

  editCategory(category: Categorie): void {
    this.editingCategory = { ...category }; // Crée une copie pour modification
  }

  saveCategory(question: Question): void {
    if (this.editingCategory) {
      this.simulationService.UpdateCategory(this.editingCategory).subscribe(() => {
        question.categories = question.categories!.map((c) =>
          c.id === this.editingCategory!.id ? this.editingCategory! : c
        );
        this.editingCategory = null;
        alert('Catégorie mise à jour avec succès');
      });
    }
  }

  cancelCategoryEdit(): void {
    this.editingCategory = null;
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      this.simulationService.deleteQuestion(questionId).subscribe(() => {
        this.questions = this.questions.filter((q) => q.id !== questionId);
        alert('Question supprimée avec succès');
      });
    }
  }
}
