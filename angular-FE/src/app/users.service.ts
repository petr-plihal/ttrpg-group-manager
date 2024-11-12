import { inject, Injectable } from '@angular/core';
import { LoginButton } from './login-button';
import { User } from './user';
import { BackendUrlService } from './backend-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url?: string;

  loginButtonList: LoginButton[] = [];

  loggedInUser?: User;

  urlService: BackendUrlService = inject(BackendUrlService);
  getAllLoginButtons(): Observable<any> {
    return this.http.get<any>(this.urlService.getUrl() + 'users/');
  }

  getLoggedInUser(): User | undefined {
    if (this.loggedInUser?.id === -1 || this.loggedInUser === undefined) {
      return undefined;
    }
    return this.loggedInUser;
  }

  setLoggedInUser(loggingUser: LoginButton): void {
    this.loggedInUser = {
      id: loggingUser.id, 
      username: loggingUser.name
    };
  }

  logOut(): void {
    this.loggedInUser = {
      id: -1, 
      username: ''
    };
  }

  createUser(username?: string): void {
    if (username === undefined || username === ''){
      return;
    }
    this.http.post<any>(this.urlService.getUrl() + 'user/', {username: username, profilepicture: 'test', description: 'test', candm: true}).subscribe(result => {
      console.log(result)
    });
    this.loginButtonList.push({id: this.loginButtonList.length+1, name: username});
  }

  constructor(private http: HttpClient) {
    this.url = this.urlService.getUrl();
  }
}
