import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Authentication/auth.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  token : any = '';
  roles : string[] = [];
  isAuthenticated : boolean = false;
  userName : string = '';
  loginForm: FormGroup;
  private routeSubscription: Subscription | undefined;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private loginService: LoginService, private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: () => {
        this.getEmail.setValue(null);
        this.getPassword.setValue(null);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login();
    } else {
      Swal.fire('Error!', 'Please check your form for errors.', 'error');
    }
  }

  get getEmail() {
    return this.loginForm.controls['email'];
  }

  get getPassword() {
    return this.loginForm.controls['password'];
  }

  private login(): void {
    this.loginService.login(this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            this.token = response.data.token;
            this.roles = response.data.roles;
            this.isAuthenticated = response.data.isAuthenticated;
            this.userName = response.data.userName;

            localStorage.setItem("token", this.token);
            localStorage.setItem("role", this.roles.toString().toLowerCase());
            localStorage.setItem("isAuthenticated", this.isAuthenticated.toString());
            localStorage.setItem("userName", this.userName);

            Swal.fire({
              title: 'Success!',
              text: 'Login successfully',
              icon: 'success',
              timer: 2500,
              showConfirmButton: false,
              width: '500px',
            });

            this.router.navigate(['/address-book']);
          } else {
            console.log("Login failed with status code: " + response.status);
          }
        },
        error: (error) => {
          Swal.fire('Error!', error.message || 'Login failed', 'error');
        }
      });
  }
}
