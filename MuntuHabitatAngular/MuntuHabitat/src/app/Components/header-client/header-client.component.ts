import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrls: ['./header-client.component.css']
})
export class HeaderClientComponent implements OnInit, OnDestroy {
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
  chat(){
    this.router.navigate(['main/chat']);
  }
}
