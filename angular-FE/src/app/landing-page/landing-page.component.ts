import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../user';
import { UsersService } from '../users.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, MenuComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  loggedUser?: User;

  UsersService: UsersService = inject(UsersService);

  constructor() {
    this.loggedUser = this.UsersService.getLoggedInUser();
  }
}
