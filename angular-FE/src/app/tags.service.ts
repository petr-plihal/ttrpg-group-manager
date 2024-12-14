import { Injectable, inject } from '@angular/core';
import { Tag } from './tag';
import { BackendUrlService } from './backend-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Header } from './header';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  urlService: BackendUrlService = inject(BackendUrlService);
/*
  getUserTags(): Observable<Header>{
    return this.
  }
  getGroupTags(): Observable<Header>{
    
  }*/
  constructor() { }
}
