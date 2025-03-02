import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../../../services/UserService';
import { RegisterDTO } from '../../../dtos/RegisterDto';
import { catchError, switchMap, throwError } from 'rxjs';
import { VerificationDto } from '../../../dtos/VerificationDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isRegistering = true;
  isVerifying = false;

  constructor(private fb: FormBuilder, private userService: UserService,  private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  // Custom Validator: Kiểm tra mật khẩu nhập lại
  passwordsMatch(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Đánh dấu tất cả các trường đã được touch
      return;
    }
    const registerDTO = new RegisterDTO(this.registerForm.value);


    this.userService.register(registerDTO).pipe(
      switchMap((response: any) => {
        this.isRegistering = false;
        this.isVerifying = true;
        this.startCountdown()
        return this.userService.sendOtp(registerDTO);
      }),
      catchError((error) => {
        const errorMessage = error.error?.message ?? "Đã xảy ra lỗi!";
        alert(errorMessage);
        this.isRegistering = true;
        this.isVerifying = false;
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        console.log("Mã OTP đã được gửi.");
      },
      error: (error: any) => {
        console.error("Lỗi khi gửi OTP:", error);
      }
    });

  }

  otpControls = new FormArray([
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')]),
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')]),
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')]),
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')]),
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')]),
    new FormControl('', [Validators.required, Validators.pattern('[0-9]{1}')])
  ]);
  countdown = 60; // 60 giây chờ
  isResendDisabled = true;
  interval: any;
  otpControlsInvalid = false;


  moveNext(event: any, index: number) {
    if (event.target.value && index < 5) {
      (document.querySelectorAll('.otp-input')[index + 1] as HTMLElement)?.focus();
    }
  }

  handleBackspace(event: any, index: number) {
    if (event.key === 'Backspace' && index > 0 && !event.target.value) {
      (document.querySelectorAll('.otp-input')[index - 1] as HTMLElement)?.focus();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const otpValues = pasteData.split('').slice(0, 6);
    otpValues.forEach((value, i) => {
      if (this.otpControls.at(i)) {
        this.otpControls.at(i).setValue(value);
      }
    });
  }

  isOtpValid(): boolean {
    return this.otpControls.controls.every(control =>
      control.value !== null && control.value !== undefined && control.value.trim() !== ''
    );
  }

  confirmOtp() {
    const otp = this.otpControls.value.join('');
    const  veryfiOtp: VerificationDto = {
      email:  this.registerForm.get('email')?.value,
      otp: otp
    };

    this.userService.verify(veryfiOtp).subscribe({
      next: (response: any) => {
        this.router.navigate(['/login']);
        this.isRegistering = true;
        this.isVerifying = false;
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

  resendOtp() {
    console.log('Gửi lại mã OTP...');
    this.countdown = 60;
    this.isResendDisabled = true;
    this.startCountdown();
    const registerDTO = new RegisterDTO(this.registerForm.value);


    this.userService.register(registerDTO).pipe(
      switchMap((response: any) => {
        this.isRegistering = false;
        this.isVerifying = true;
        return this.userService.sendOtp(registerDTO);
      }),
      catchError((error) => {
        const errorMessage = error.error?.message ?? "Đã xảy ra lỗi!";
        alert(errorMessage);
        this.isVerifying = false;
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        console.log("Mã OTP đã được gửi.");
      },
      error: (error: any) => {
        console.error("Lỗi khi gửi OTP:", error);
      }
    });
  }

  startCountdown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.isResendDisabled = false;
      }
    }, 1000);
  }


}
