import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/services/post.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = []; // Liste filtrée
  searchTerm: string = '';
  displayedPosts: any[] = [];
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // Appel du service pour récupérer tous les posts
    this.postService.getAllPosts().subscribe(
      (response) => {
        this.posts = response;
        this.displayedPosts = response;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  searchPosts(): void {
    if (this.searchTerm.trim() === '') {
      this.displayedPosts = this.posts; // Affiche tout si aucun terme n'est saisi
    } else {
      const term = this.searchTerm.toLowerCase();
      this.displayedPosts = this.posts.filter(post =>
        post.title.toLowerCase().includes(term)
      );
    }
  }
}
