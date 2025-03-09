import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agent-home',
  templateUrl: './agent-home.component.html',
  styleUrl: './agent-home.component.css'
})
export class AgentHomeComponent implements OnInit {
  userInfo: any = null;

  constructor(private readonly apiService: TokenService, private router: Router) { }

  isAgent: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAgent = this.apiService.isAgent();

    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAgent = this.apiService.isAgent();
    })
  }

  handleLogout() {
    const confirm = window.confirm("Are you sure you want to log out? ")
    if (confirm) {
      this.apiService.logout();
      this.router.navigate(['/home'])
      this.apiService.authStatuschanged.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

}
