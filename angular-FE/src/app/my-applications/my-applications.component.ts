import { Component, inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { Application } from '../application';
import { ApplicationService } from '../application-service.service';
import { UsersService } from '../users.service';
import { User } from '../user';
import { GroupsService } from '../groups.service';
import { Group } from '../group';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [MenuComponent, CommonModule, RouterLink],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css'
})
export class MyApplicationsComponent {
  outboundApps: Application[] = [];
  inboundApps: Application[] = [];

  ownedGroups: Group[] = [];

  nameMap: Map<number, string> = new Map<number, string>();

  loggedUser?: User;

  applicationService: ApplicationService = inject(ApplicationService)
  userService: UsersService = inject(UsersService)
  groupService: GroupsService = inject(GroupsService)

  constructor() {
    this.loggedUser = this.userService.getLoggedInUser();
    this.applicationService.getUserApplications(this.loggedUser!.id).subscribe(result => {
      for(let i = 0; i < result.data.length; i++){
        this.outboundApps.push({
          id: result.data[i].pk,
          applicantid: result.data[i].fields.applicantid,
          groupid: result.data[i].fields.groupid,
          description: ''
        })
        this.groupService.getGroupById(result.data[i].fields.groupid).subscribe(groupName => {
          console.log(groupName)
          this.nameMap.set(result.data[i].fields.groupid, groupName.data[0].fields.name)
        })
      }
    })
    this.groupService.getOwnedGroups(this.loggedUser!.id).subscribe(groupsList => {
      for(let i = 0; i < groupsList.data.length; i++){
        console.log(groupsList.data[i].pk)
        this.ownedGroups.push({
          id: groupsList.data[i].pk,
            name: groupsList.data[i].fields.name,
            location: groupsList.data[i].fields.location,
            isopen: groupsList.data[i].fields.isopen,
            maxsize: groupsList.data[i].fields.maxsize,
            dmneeded: groupsList.data[i].fields.dmneeded,
            description: groupsList.data[i].fields.description
        })
        console.log(groupsList.data[i].pk)
        this.applicationService.getGroupApplications(groupsList.data[i].pk).subscribe(results => {
          for(let i = 0; i < results.data.length; i++){
            this.inboundApps.push({
              id: results.data[i].pk,
              applicantid: results.data[i].fields.applicantid,
              groupid: results.data[i].fields.groupid,
              description: ''
            })
          }
          this.nameMap.set(results.data[i].pk, groupsList.data[i].fields.name)
        })
      }

      
    })
  }
}
