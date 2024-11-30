import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoockieService {

  setCookie(name: string, value: string, expires?: Date, path: string = '/'): void {
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path};`;

    if (expires) 
      cookie += ` expires=${expires.toUTCString()};`;
    
    document.cookie = cookie;
    console.log('Cookie armazenado:', cookie);
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    const cookieValue = match ? decodeURIComponent(match[2]) : null;
    console.log('Valor do cookie ' + name + ':', cookieValue);
    return cookieValue;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log('Cookie removido:', name);
  }
}