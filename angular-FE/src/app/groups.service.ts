import { inject, Injectable } from '@angular/core';
import { BackendUrlService } from './backend-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './group';
import { Header } from './header';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  url?: string;

  urlService: BackendUrlService = inject(BackendUrlService);

  getAllGroups(): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'groups/');
  }
  getGroupOwner(group_id: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'group/'+group_id+'/owner/');
  }
  getUserGroups(userid: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'user/'+ userid +'/groups/');
  }
  getGroupById(id: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'group/' + id + '/id');
  }

  getGroupPlayers(id: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'group/' + id + '/players/');
  }

  getOwnedGroups(id: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'user/'+ id +'/ownedGroups/');
  }

  setOwner(userid: number, groupid: number): Observable<Header> {
    return this.http.get<Header>(this.urlService.getUrl() + 'group/'+ groupid +'/owner/'+ userid +'/');
  }

  createGroup(name: string, location: string, isopen: boolean, description: string, maxsize: number, dmneeded: boolean, userid: number): Observable<any> {
    return this.http.post<any>(this.urlService.getUrl() + 'group/', {name: name,
      description: description,
      location: location,
      isopen: isopen,
      languages: 'English',
      maxsize: maxsize,
      dmneeded: dmneeded,
      gameid: 1})
    
  }

  updateGroup(group: Group): Observable<any>{
    return this.http.put<any>(this.urlService.getUrl() + 'group/'+ group.id +'/update/', group)
  }

  applyToGroup(groupid: number, userid: number):  Observable<any>{
    return this.http.post<any>(this.urlService.getUrl() + 'applyToGroup/', {group_id: groupid, user_id: userid})
  }

  deleteGroup(userid: number):  Observable<any>{
    return this.http.delete<any>(this.urlService.getUrl() + 'group/'+ userid +'/delete/')
  }

  leaveGroup(userid: number, groupid: number):  Observable<any>{
    return this.http.post<any>(this.urlService.getUrl() + 'kickPlayer/', {user_id: userid, group_id: groupid})
  }

  constructor(private http: HttpClient) { 
    this.url = this.urlService.getUrl();
  }
}
