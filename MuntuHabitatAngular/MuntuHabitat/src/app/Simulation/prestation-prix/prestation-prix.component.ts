import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-prestation-prix',
  templateUrl: './prestation-prix.component.html',
  styleUrl: './prestation-prix.component.css'
})
export class PrestationPrixComponent  implements OnInit {
  users: any[] = [];
  agent: any;
p: number =1;
  constructor(private userService: TokenService) {}

  ngOnInit(): void {
    this.userService.getUsersAndAgents().subscribe(
      (response) => {
        if (response.users) {
          this.users = response.users;
        } else if (response.user) {
          this.agent = response.user;
        }
      },
      (error) => {
        console.error('Error retrieving data', error);
      }
    );
  }
}
