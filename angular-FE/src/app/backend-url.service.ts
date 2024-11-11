import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendUrlService {
  url: string = 'http://127.0.0.1:8000/';


  getUrl(): string {
    return this.url;
  }

  constructor() { }
}
