import { Component, OnInit, Input  } from '@angular/core';
import { PostService } from '../../services/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrl: './list-post.component.css'
})
export class ListPostComponent implements OnInit {
  userId: number | null = null;
  posts: any[] = [];
  isAuthenticated: boolean = false;
p : number = 1
  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.postService.isAuthenticated()) {
      this.userId = this.postService.getUserId();
      this.isAuthenticated = true;

      if (this.userId !== null) {
        this.postService.getPostsByUser(this.userId).subscribe(response => {
          this.posts = response;
        });
      } else {
        console.log('L\'ID de l\'utilisateur est introuvable');
      }
    } else {
      this.isAuthenticated = false;
      console.log('Utilisateur non authentifié');
      this.router.navigate(['/login']);
    }
  }
  toggleLike(post: any): void {
    post.isLiked = !post.isLiked;
 }
}
