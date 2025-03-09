import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/services/post.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css'
})
export class AllPostsComponent implements OnInit {
  posts: any[] = [];
  p: number = 1;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPostsForAgent().subscribe(
      (response) => {
        this.posts = response;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  delete(postId: number): void {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        // Supprimer le rendez-vous de la liste
        this.posts = this.posts.filter(appointment => appointment.id !== postId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du rendez-vous', err);
      }
    });
  }
}
