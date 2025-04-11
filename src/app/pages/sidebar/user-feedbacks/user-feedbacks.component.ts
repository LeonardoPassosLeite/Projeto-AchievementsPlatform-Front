import { Component, OnInit } from '@angular/core';
import { SteamUserService } from '../../../shared/services/steam-user.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { TokenStorageService } from '../../../core/auth/tokenStorage.service';

@Component({
  selector: 'app-user-feedbacks',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './user-feedbacks.component.html',
  styleUrl: './user-feedbacks.component.scss'
})
export class UserFeedbacksComponent implements OnInit {
  feedbacks: any[] = [];
  private token: string | null = null;

  constructor(
    private steamUserService: SteamUserService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie();
    console.log(this.token)

    if (this.token) {
      this.loadFeedbackBySteamId();
    } else {
      console.error("Erro: Token de autenticação não encontrado!");
    }
  }

  loadFeedbackBySteamId(): void {
    if (!this.token) return; 

    this.steamUserService.getUserFeedbacks(this.token).subscribe({
      next: (feedbacks) => {
        console.log('Feedbacks do usuário:', feedbacks);
        this.feedbacks = feedbacks;
      },
      error: (err) => {
        console.error('Erro ao buscar feedbacks:', err.message);
      }
    });
  }
}