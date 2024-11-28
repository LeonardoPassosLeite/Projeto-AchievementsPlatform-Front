import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CoockieService {
    getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }
}