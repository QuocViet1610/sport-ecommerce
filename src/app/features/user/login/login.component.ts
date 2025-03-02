import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginDTO } from '../../../dtos/loginDto';
import { UserService } from '../../../services/UserService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService,  private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Đánh dấu tất cả các trường đã được touch
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const  loginDTO: LoginDTO = {
      email:  email,
      password: password
    };

    this.userService.login(loginDTO).subscribe({
          next: (response: any) => {
            this.router.navigate(['/home']);
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            debugger;
            alert(error.error.message);
          }
        });
  }

  togglePassword() {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    const toggleIcon = document.getElementById('toggleIcon') as HTMLElement;

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      toggleIcon.classList.remove('fa-eye');
      toggleIcon.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      toggleIcon.classList.remove('fa-eye-slash');
      toggleIcon.classList.add('fa-eye');
    }
  }

}
