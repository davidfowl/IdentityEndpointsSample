import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy   {
  user: any;
  expiryDate: Date | null = null;
  private subscription: Subscription | undefined;

  constructor(private authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subscription = this.authService.getUser().subscribe(user => {
      this.user = user;      
      this.expiryDate = new Date(Number(localStorage.getItem('expiresIn')));
    });
  }

  refreshToken(): void {
    this.authService.refreshToken().subscribe({
      next: (result) => {
          if(result) {
            this.expiryDate = new Date(Number(localStorage.getItem('expiresIn')));
          }
      },
      error: (err) => {
          // handle error
          this.snackBar.open('Error refreshing the token', 'Dismiss', {
            duration: 3000,
          });
      }
  });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
