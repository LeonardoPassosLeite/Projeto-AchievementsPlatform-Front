import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { AccountGameService } from '../../shared/services/account-game.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { SteamUser } from '../../shared/models/steam-user.model';
import { AccountGame } from '../../shared/models/account-game.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  steamUser: SteamUser | null = null;
  accountGames: AccountGame[] = []
  errorMessage: string | null = null;
  loading = true

  constructor(
    private steamUserService: SteamUserService,
    private accountGameService: AccountGameService,
    private errorHandlingService: ErrorHandlingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.loadSteamUser(token);
      this.loadAccountGames(token);
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
    }
  }

  loadSteamUser(token: string): void {
    this.steamUserService.getStoredUser(token).subscribe({
      next: (response) => {
        this.steamUser = response;
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,  
    });
  }

  loadAccountGames(token: string): void {
    this.accountGameService.getAccountGames(token).subscribe({
      next: (response) => {
        this.accountGames = response;
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,   
    });
  }
}