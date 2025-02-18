import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenericModule } from '../../shareds/commons/GenericModule';
import { AuthService } from '../shared/services/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GenericModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  handleLogin(): void {
    window.location.href = `${environment.baseLoginUrl}/steam`;
  }
}