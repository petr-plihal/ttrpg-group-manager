import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  shown: boolean = false

  loggedUser?: User;

  userService: UsersService = inject(UsersService)
  toggleMenu(): void{
    if(this.shown){
      this.shown = false
      return
    }
    this.shown = true
    return
  }
  constructor() {
    this.loggedUser = this.userService.getLoggedInUser();
  }
}
