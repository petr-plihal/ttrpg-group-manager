import { inject, Injectable } from '@angular/core';
import { BackendUrlService } from './backend-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  url?: string;

  urlService: BackendUrlService = inject(BackendUrlService);

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.urlService.getUrl() + 'groups/');
  }

  createGroup(name: string, location: string, isopen: boolean, description: string, maxsize: number, dmneeded: boolean): void {
    this.http.post<any>(this.urlService.getUrl() + 'group/', {name: name,
      description: description,
      location: location,
      isopen: isopen,
      languages: 'test',
      maxsize: maxsize,
      dmneeded: dmneeded,
      gameid: 1,
      groupchatcontent: 'test'}).subscribe(result => {
      console.log(result)
    });
  }

  constructor(private http: HttpClient) { 
    this.url = this.urlService.getUrl();
  }
}
