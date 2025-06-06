import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoockieService {

  // setCookie(name: string, value: string, expires?: Date, path: string = '/'): void {
  //   let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=None; Secure;`;
  
  //   if (expires) {
  //     cookie += ` expires=${expires.toUTCString()};`;
  //   }
  
  //   document.cookie = cookie;
  // }
  

  //dev
  setCookie(name: string, value: string, expires?: Date, path: string = '/'): void {
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path};`;
  
    if (expires) {
      cookie += ` expires=${expires.toUTCString()};`;
    }
  
    if (location.protocol === 'https:') {
      cookie += ` SameSite=None; Secure;`;
    }
  
    document.cookie = cookie;
  }
  

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    const cookieValue = match ? decodeURIComponent(match[2]) : null;
    return cookieValue;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}