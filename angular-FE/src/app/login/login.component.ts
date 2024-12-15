import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { LoginButton } from '../login-button';
import { UsersService } from '../users.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../user';
import { Header } from '../header';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginButtonComponent, RouterLink, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginButtonList: LoginButton[] = [];

  usersList?: User[];

  createUserResult: any = '';

  errorMsg: string = '';

  UsersService: UsersService = inject(UsersService);

  createUserForm = new FormGroup({
    username: new FormControl('')
  });

  loginButtonClick(button: LoginButton): void {
    this.UsersService.setLoggedInUser(button);
  }

  createUser(): void {  
    this.errorMsg = '';
    if(this.createUserForm.value.username != undefined && this.createUserForm.value.username != ''){
        this.UsersService.createUser(this.createUserForm.value.username ?? '').pipe(catchError(err => {
        this.errorMsg = err.error.message;
        throw 'error in source. Details: ' + err.error.message;
      })).subscribe(result => {
        console.log(result)
        this.loginButtonList.push({id: result.data[0].pk, name: result.data[0].fields.username, imageurl: result.data[0].fields.profilepicture});
        return;
      })
    } else {
      this.errorMsg = 'The username can\'t be empty.'
    } 
  }

  constructor() {
    this.UsersService.getAllLoginButtons().subscribe((usersList: any) => {
      for(let i = 0; i < usersList.data.length; i++){
        this.loginButtonList.push({
          id: usersList.data[i].pk,
          name: usersList.data[i].fields.username,
          imageurl: usersList.data[i].fields.profilepicture ?? ''
        })
      };
    });
  }
}
