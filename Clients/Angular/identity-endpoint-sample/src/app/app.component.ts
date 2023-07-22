import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'identity-endpoint-sample';
  
  constructor(public authService: AuthService, private router: Router) { }

  
  logout() {    
    this.authService.logout();
  //redirect to login page    
  this.router.navigate(['/login']).catch(error => {
    console.error('Navigation error: ', error);
  });
}
}
