import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { RegisterService } from '../../../services/register.service';
import { AuthService } from '../../../Authentication/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  token : any = '';
  expiresOn : any = '';
  registerForm: FormGroup;
  private registerSubscription: Subscription | undefined;

  constructor(private router: Router, private registerService: RegisterService, private authService: AuthService) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      userName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(30)]),
      passwordUser: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnDestroy(): void {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.register();
    }
  }

  get getFirstName() {
    return this.registerForm.controls['firstName'];
  }

  get getLastName() {
    return this.registerForm.controls['lastName'];
  }

  get getUserName() {
    return this.registerForm.controls['userName'];
  }

  get getAddress() {
    return this.registerForm.controls['address'];
  }

  get getEmail() {
    return this.registerForm.controls['email'];
  }

  get getPassword() {
    return this.registerForm.controls['passwordUser'];
  }

  get getConfirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  private register(): void {
    this.registerSubscription = this.registerService.Register(this.registerForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            this.token = response.data.token;
            this.expiresOn = response.data.expiresOn;
            localStorage.setItem("token", this.token);
            localStorage.setItem("expiresOn", this.token);

            Swal.fire({
              title: 'Success!',
              text: 'Registration process has been completed successfully.',
              icon: 'success',
              timer: 2500,
              showConfirmButton: false,
              width: '500px',
              customClass: {
                popup: 'custom-popup-class',
                title: 'custom-title-class'
              }
            });

            this.router.navigate(['/address-book']);
            window.location.reload();
          } else {
            console.log("Register failed with status code: " + response.status);
            this.router.navigate(['/login']);
            window.location.reload();
          }
        },
        error: (error) => {
          Swal.fire('Error!', error.message || 'Register failed', 'error');
        }
      });
  }
}
