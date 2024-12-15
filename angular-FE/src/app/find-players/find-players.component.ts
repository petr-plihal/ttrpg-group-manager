import { Component, inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { User } from '../user';
import { LoginButton } from '../login-button';
import { UsersService } from '../users.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerItemComponent } from '../player-item/player-item.component';

@Component({
  selector: 'app-find-players',
  standalone: true,
  imports: [MenuComponent, PlayerItemComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './find-players.component.html',
  styleUrl: './find-players.component.css'
})
export class FindPlayersComponent {

  usersList?: User[] = [];

  filteredUsersList: User[] = [];

  UsersService: UsersService = inject(UsersService);

  SearchUserForm = new FormGroup({
    username: new FormControl('')
  });

  searchUsers(): void {
    this.filteredUsersList = this.usersList!.filter((user) =>  user.username.includes(this.SearchUserForm.value.username ?? ''));
  }

  //change this to something better afterwards
  constructor() {
    this.UsersService.getAllLoginButtons().subscribe((usersList: any) => {
      for(let i = 0; i < usersList.data.length; i++){
        this.usersList!.push({
          id: usersList.data[i].pk,
          username: usersList.data[i].fields.username,
          profilePic: usersList.data[i].fields.profilepicture.replace('<URL>','.') ?? ''
        })
      };
      this.filteredUsersList = this.usersList!;
    });
  }
}
