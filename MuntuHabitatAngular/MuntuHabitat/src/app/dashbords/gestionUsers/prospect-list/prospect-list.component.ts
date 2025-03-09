import { Component, OnInit } from '@angular/core';
import { RegistrationRequest, Role, User } from '../../../services/models';
import { UserControllerService } from '../../../services/services';
import { TokenService } from '../../../services/token/token.service';
import { Prospect } from '../../../services/models/prospect';

@Component({
  selector: 'app-prospect-list',
  templateUrl: './prospect-list.component.html',
  styleUrl: './prospect-list.component.css'
})
export class ProspectListComponent implements OnInit {
  users: any[] = [];
  selectedProspect: Prospect | null = null;
  errorMsg: any = null;
p:number=1
  constructor(private userService: TokenService) {}

  ngOnInit(): void {
    this.getProspects();
  }

  getProspects(): void {
    this.userService.getProspects().subscribe(
      (data) => {
        this.users = data.filter(user => user.role === 'PROSPECT');
      },
      (error) => {
        console.error('Error fetching prospects:', error);
      }
    );
  }

  selectProspect(prospect: any): void {
    this.selectedProspect = prospect;
  }
}
