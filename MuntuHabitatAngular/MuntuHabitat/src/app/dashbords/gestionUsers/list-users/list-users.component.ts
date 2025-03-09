import { Component, ViewChild } from '@angular/core';
import { TokenService } from '../../../services/token/token.service';
import { NotificationService } from '../../../Components/notification/notification.service';
import { ModalDeleteConfirmationComponent } from '../../../Components/modal/modal-delete-confirmation.component';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
  users: any[] = [];
  error:any = null;
p:number=1
idUserToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Delete User", content : "voulez vous vraiment supprimer le user!"}

  constructor(private userService:TokenService, private notifService : NotificationService ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.userList || [];
      },
      error: (err) =>{
        this.error = err?.error?.message || 'unable to get users'
      }
    });
  }

  delete(): void {

      this.userService.deleteUser(this.idUserToDelete).subscribe({
        next: () => {
          this.modalDelete?.close();
          this.notifService.success('User deleted successfully.')
          this.loadUsers(); // Reload the list after deletion
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error?.message || 'Unable to delete user';
          this.modalDelete?.close();
          this.notifService.warn('Unable to delete user! User have different actions!')

        }
      });
    
  }
  confirmDelete(id : any) {
    this.idUserToDelete = id ;
    this.modalDelete?.open();
      }
}
