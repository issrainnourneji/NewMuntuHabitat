import { Component, OnInit } from '@angular/core';
import { RegistrationRequest, Role, User } from '../../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, UserControllerService } from '../../../services/services';
import { TokenService } from '../../../services/token/token.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../Components/notification/notification.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrl: './add-agent.component.css'
})
export class AddAgentComponent {

  constructor(private readonly apiService: TokenService, private router: Router, private notifServer : NotificationService) { }
  formData: any = {
    email: '',
    name: '',
    phoneNumber: '',
    address:'',
    password: ''
  }

  message: any = null;


  async onSubmit() {
    if (!this.formData.email || !this.formData.name || !this.formData.phoneNumber || !this.formData.password) {
      this.showMessage("All fields are required")
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.registerAgent(this.formData));
      if (response.status === 200) {
        this.notifServer.success('User added succefully')
      }
    } catch (error: any) {
        console.log(error)
        this.showMessage(error.error?.message || error.message || 'unable to register');
        this.notifServer.error('Unable to register! Verif the informations')

    }
  }



  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message == null
    }, 3000);
  }
}
