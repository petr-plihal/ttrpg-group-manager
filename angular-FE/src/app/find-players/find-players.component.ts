import { Component, inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { User } from '../user';
import { LoginButton } from '../login-button';
import { UsersService } from '../users.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-find-players',
  standalone: true,
  imports: [MenuComponent, LoginButtonComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './find-players.component.html',
  styleUrl: './find-players.component.css'
})
export class FindPlayersComponent {
  loginButtonList: LoginButton[] = [];

  filteredLoginButtonList: LoginButton[] = []

  usersList?: User[];

  UsersService: UsersService = inject(UsersService);

  SearchUserForm = new FormGroup({
    username: new FormControl('')
  });

  searchUsers(): void {
    this.filteredLoginButtonList = this.loginButtonList.filter((loginButton) =>  loginButton.name.includes(this.SearchUserForm.value.username ?? ''));
  }

  //change this to something better afterwards
  constructor() {
    this.UsersService.getAllLoginButtons().subscribe((usersList: any) => {
      for(let i = 0; i < usersList.data.length; i++){
        this.loginButtonList.push({
          id: usersList.data[i].pk,
          name: usersList.data[i].fields.username,
          imageurl: usersList.data[i].fields.profilePic ?? ''
        })
      };
      this.filteredLoginButtonList = this.loginButtonList;
    });
  }
}
