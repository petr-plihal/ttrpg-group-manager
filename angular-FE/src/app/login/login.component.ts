import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { LoginButton } from '../login-button';
import { UsersService } from '../users.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../user';

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

  UsersService: UsersService = inject(UsersService);

  createUserForm = new FormGroup({
    username: new FormControl('')
  });

  loginButtonClick(button: LoginButton): void {
    this.UsersService.setLoggedInUser(button);
  }

  createUser() {
    this.UsersService.createUser(this.createUserForm.value.username ?? '');
  }


  //change this to something better afterwards
  constructor() {
    this.UsersService.getAllLoginButtons().subscribe((usersList: any) => {
      for(let i = 0; i < usersList.data.length; i++){
        this.loginButtonList.push({
          id: usersList.data[i].pk,
          name: usersList.data[i].fields.username
        })
      };
    });
  }
}
