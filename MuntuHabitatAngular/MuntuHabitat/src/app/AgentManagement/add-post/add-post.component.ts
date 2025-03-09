import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PostService } from '../../services/services/post.service';
import { TokenService } from '../../services/token/token.service';
import { NotificationService } from '../../Components/notification/notification.service';

declare var bootstrap: any; // Déclare Bootstrap pour pouvoir utiliser le modal

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit, AfterViewInit {
  title = '';
  description = '';
  image: File | null = null;
  userId: number | null = null;
  users: any[] = [];
  agent: any;

  constructor(private postService: PostService, private userservice: TokenService, private notifService : NotificationService) { }

  ngOnInit(): void {
    this.userservice.getUsersAndAgents().subscribe(
      (response) => {
        if (response.users) {
          this.users = response.users; // Utilisateurs assignés à l'agent
        } else if (response.user) {
          this.agent = response.user; // Agent assigné à l'utilisateur
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs/agents', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Initialiser le modal de Bootstrap après que la vue a été chargée
  }

  onFileChange(event: any): void {
    this.image = event.target.files[0];
  }

  addPost(): void {
    // Vérifier si les champs nécessaires sont remplis
    if (!this.userId || !this.image) {
      this.notifService.error("Vérifier les champs requis.");
      return;
    }

    // Si tous les champs sont valides, envoyer la requête d'ajout
    this.postService.addPostForUser(this.userId, this.title, this.description, this.image)
      .subscribe({
        next: (response) => {
          console.log('Post ajouté:', response);

          // Afficher le modal après le succès
          const postModal = new bootstrap.Modal(document.getElementById('postModal'));
          postModal.show();
        },
        error: (error) => {
          console.error('Erreur:', error);

          // Afficher un message d'erreur approprié avec la notification
          let errorMessage = error.message || 'Une erreur est survenue lors de l\'ajout du post.';
          this.notifService.error(errorMessage);
        }
      });
  }

  reloadPage(): void {
    location.reload(); // Recharge la page lorsque le modal est fermé
  }
}
