import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { IUsers } from '../../../models/admin-models/iusers';
import { UsersService } from '../../../services/admin-services/users.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy{
  users: IUsers[];
  private userSubscription!: Subscription;

  constructor(private _userService: UsersService, private _router: Router) {
    this.users = [];
  }


  ngOnInit(): void {
    this.userSubscription = this._userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(data);
      },
      error: (error) => {
        Swal.fire(
          'Error!',
          error.message,
          'error'
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
