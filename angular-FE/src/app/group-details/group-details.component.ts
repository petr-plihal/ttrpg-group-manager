import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule, NgFor } from '@angular/common';
import { Group } from '../group';
import { GroupsService } from '../groups.service';
import { User } from '../user';
import { BelongsTo } from '../belongs-to';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [MenuComponent, CommonModule, NgFor],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css'
})
export class GroupDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  groupId: number = -1;

  GroupsService: GroupsService = inject(GroupsService);
  UsersService: UsersService = inject(UsersService);

  groupDetail?: Group;

  playerList: BelongsTo[] = []

  toggleIsOpen() {
    if(this.groupDetail != undefined){
      this.groupDetail.isopen = !this.groupDetail?.isopen;

    }
  }

  ngOnInit() {
    this.GroupsService.getGroupPlayers(this.groupId).subscribe((BelongsTo: any) => {
      for(let i = 0; i < BelongsTo.data.length; i++){
        this.playerList.push({
          id: BelongsTo.data[i].id,
          userid: BelongsTo.data[i].fields.userid,
          groupid: BelongsTo.data[i].fields.groupid,
          isdm: BelongsTo.data[i].fields.isdm,
          isowner: BelongsTo.data[i].fields.isdm,
          nickname: BelongsTo.data[i].fields.nickname,
        })
        //if the user doesnt have a nickname then use their username
        if(this.playerList[i].nickname === undefined || this.playerList[i].nickname === null || this.playerList[i].nickname === ''){
          this.UsersService.getUserById(this.playerList[i].userid).subscribe(User => {
            this.playerList[i].nickname = User.data[0].fields.username
          }
          )
        }
      }
      
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
