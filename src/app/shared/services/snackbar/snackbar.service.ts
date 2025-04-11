import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) { }

    showSuccess(message: string, duration = 3000): void {
        this.snackBar.open(message, 'Fechar', {
            duration,
            panelClass: 'snackbar-success',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    showError(message: string, duration = 3000): void {
        this.snackBar.open(message, 'Fechar', {
            duration,
            panelClass: 'snackbar-error',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    showCustom(message: string, panelClass: string = '', duration = 3000): void {
        this.snackBar.open(message, 'Fechar', {
            duration,
            panelClass,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}