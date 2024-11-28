import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  isLoading = true;
  message: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.syncAndStoreUserData().subscribe({
      next: () => {
        console.log('Redirecionando para /conquistas...');
        this.router.navigate(['/conquistas']);
      },
      error: (err) => {
        this.message = err.message; 
        this.isLoading = false;
      },
    });
  }
}