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
  url?: string;

  urlService: BackendUrlService = inject(BackendUrlService);
  getUserTags(userid: number): Observable<Header>{
    return this.http.get<any>(this.urlService.getUrl() + 'user/' + userid + '/tags/')
  }
  getGroupTags(groupid: number): Observable<Header>{
    return this.http.get<any>(this.urlService.getUrl() + 'group/' + groupid + '/tags/')
  }
  constructor(private http: HttpClient) { 
    this.url = this.urlService.getUrl();
  }
}
