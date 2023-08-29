import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-register',  
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent  implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.controls['password'].value === this.registerForm.controls['passwordConfirm'].value) {
        this.authService.register(
          this.registerForm.controls['email'].value,
          this.registerForm.controls['username'].value,
          this.registerForm.controls['password'].value
        ).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: (err) => {
              // Parse error here
              let errorMessage = '';
              if (err.error.errors) {
                for (const key in err.error.errors) {
                  if (err.error.errors[key]) {
                    errorMessage += err.error.errors[key].join('\n');
                  }
                }
              }
              this.snackBar.open(errorMessage, 'Close', {
                duration: 5000,
              });
            }
        });
      } else {
        this.snackBar.open('Password and Confirm Password do not match!', 'Close', {
          duration: 3000
        });
        this.registerForm.controls['password'].setErrors({'incorrect': true});
        this.registerForm.controls['passwordConfirm'].setErrors({'incorrect': true});
      }
    }
}

}
