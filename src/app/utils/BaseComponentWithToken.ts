import { Component, Directive, OnInit } from '@angular/core';
import { TokenStorageService } from '../shared/services/auth/tokenStorage.service';
import { ErrorHandlingService } from '../shared/services/commons/error-handlig.service';

@Directive()
export abstract class BaseComponentWithToken implements OnInit {
  token: string | null = null;
  errorMessage: string | null = null;

  constructor(
    protected tokenStorageService: TokenStorageService,
    protected errorHandlingService: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie();

    if (!this.token) {
      this.errorMessage = 'Token de autenticação não encontrado.';
      return;
    }

    this.loadData();
  }

  abstract loadData(): void;

  protected handleError(error: any, message: string): void {
    this.errorMessage = this.errorHandlingService.handleHttpError(error);
    console.error(message, error);
  }
}