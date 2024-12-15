import { inject, Injectable } from '@angular/core';
import { BackendUrlService } from './backend-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  url?: string;

  urlService: BackendUrlService = inject(BackendUrlService);

  invitePlayer(userid: number, groupid: number): Observable<any>{
    return this.http.post<any>(this.urlService.getUrl() + 'invitePlayer/', {user_id: userid, group_id: groupid})
  }

  acceptInvite(appid: number): Observable<any>{
    return this.http.post(this.urlService.getUrl() + 'acceptApplication/'+ appid +'/', {})
  }

  constructor(private http: HttpClient) { 
      this.url = this.urlService.getUrl();
    }
}
