import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { Group } from '../group';
import { GroupsService } from '../groups.service';
import { User } from '../user';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css'
})
export class GroupDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  groupId: number = -1;

  GroupsService: GroupsService = inject(GroupsService);

  groupDetail?: Group;

  playerList: User[] = []

  ngOnInit() {
    this.GroupsService.getGroupPlayers(this.groupId).subscribe((BelongsTo: any) => {
      console.log(BelongsTo)
    })
  }

  constructor() {
    this.groupId = Number(this.route.snapshot.params['id'])
    this.GroupsService.getGroupById(this.groupId).subscribe((Group: any) => {
      this.groupDetail = {
        id: Group.data[0].pk,
        name: Group.data[0].fields.name,
        description: Group.data[0].fields.description,
        location: Group.data[0].fields.location,
        isopen: Group.data[0].fields.isopen,
        languages: Group.data[0].fields.languages,
        maxsize: Group.data[0].fields.maxsize,
        dmneeded: Group.data[0].fields.dmneeded,
        gameid: Group.data[0].fields.gameid
      }
    })
  }
}
