import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css'
})
export class PlayerDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  playerId = -1;

  UsersService: UsersService = inject(UsersService);

  userDetail?: User;
  constructor() {
    this.playerId = Number(this.route.snapshot.params['id'])
    this.UsersService.getUserById(this.playerId).subscribe((User: any) => {
      this.userDetail = {
        id: User.data[0].pk,
        username: User.data[0].fields.username,
        profilePic: User.data[0].fields.profilepicture,
        desc: User.data[0].fields.description,
        canDM: User.data[0].fields.candm
      }
    })
  }
}
