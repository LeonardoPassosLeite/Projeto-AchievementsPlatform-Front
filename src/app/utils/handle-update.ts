import { Observable } from 'rxjs';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';
import { ErrorHandlingService } from '../shared/services/commons/error-handlig.service';

export function handleUpdate<T>(
    request$: Observable<T>,
    options: {
        onSuccessMessage: string;
        onErrorMessage: string;
        onSuccessAction?: () => void;
        onErrorAction?: () => void;
        setLoading?: (loading: boolean) => void;
        snackbarService: SnackbarService;
        errorHandlingService?: ErrorHandlingService;
    }
): void {
    options.setLoading?.(true);

    request$.subscribe({
        next: () => {
            options.snackbarService.showSuccess(options.onSuccessMessage);
            options.onSuccessAction?.();
            options.setLoading?.(false);
        },
        error: (err) => {
            options.errorHandlingService?.handleHttpError?.(err);
            options.snackbarService.showError(options.onErrorMessage);
            options.onErrorAction?.();
            options.setLoading?.(false);
        }
    });
}