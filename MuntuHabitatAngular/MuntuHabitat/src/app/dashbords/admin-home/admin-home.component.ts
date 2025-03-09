import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
  userInfo: any = null;

  constructor(private readonly apiService: TokenService, private router: Router) { }

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();

    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
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
