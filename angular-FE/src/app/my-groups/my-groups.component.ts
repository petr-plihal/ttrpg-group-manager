import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../user';
import { UsersService } from '../users.service';
import { Group } from '../group';
import { GroupsService } from '../groups.service';
import { GroupItemComponent } from '../group-item/group-item.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { ApplicationService } from '../application-service.service';

@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [RouterLink, GroupItemComponent, CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './my-groups.component.html',
  styleUrl: './my-groups.component.css'
})
export class MyGroupsComponent {
  loggedUser?: User;

  UsersService: UsersService = inject(UsersService);

  GroupsService: GroupsService = inject(GroupsService);

  ApplicationService: ApplicationService = inject(ApplicationService);

  myGroupsList: Group[] = [];

  filteredmyGroupsList: Group[] = [];

  groupList: Group[] = [];
  
  filteredList: Group[] = [];

  errorMsg: string = '';

  searchGroupName = new FormControl('');

  createGroupForm = new FormGroup({
    name: new FormControl(''),
    location: new FormControl(''),
    isopen: new FormControl(false),
    description: new FormControl(''),
    maxsize: new FormControl(0),
    dmneeded: new FormControl(false),
  });

  createGroup(): void {
    this.GroupsService.createGroup(this.createGroupForm.value.name ?? '', this.createGroupForm.value.location ?? '', this.createGroupForm.value.isopen ?? false, this.createGroupForm.value.description ?? '', this.createGroupForm.value.maxsize ?? 5, this.createGroupForm.value.dmneeded ?? false, this.loggedUser!.id).subscribe(result => {
      this.ApplicationService.invitePlayer(this.loggedUser!.id , result.groupid).subscribe(appResult =>{
        this.ApplicationService.acceptInvite(appResult.data[0].pk).subscribe(acceptResult => {
          this.GroupsService.setOwner(this.loggedUser!.id, result.groupid).subscribe(lastResult => {
            this.refreshGroups()
          })
        })
      })
    });;
  }

  searchGroup(): void {
    this.filteredList = [];
    for(let i = 0; i < this.groupList.length; i++){    
      if(this.groupList[i].name.includes(this.searchGroupName.value ?? '')){
        this.filteredList.push(this.groupList[i])
      }
    }
    this.filteredmyGroupsList = [];
    for(let i = 0; i < this.myGroupsList.length; i++){    
      if(this.myGroupsList[i].name.includes(this.searchGroupName.value ?? '')){
        this.filteredmyGroupsList.push(this.myGroupsList[i])
      }
    }
  }

  refreshGroups() {
    this.GroupsService.getUserGroups(this.loggedUser!.id).subscribe((groupsList: any) => {
      for(let i = 0; i < groupsList.data.length; i++){
        this.GroupsService.getGroupOwner(groupsList.data[i].pk).subscribe((owner: any) => {
          if(owner.data[0].pk === this.loggedUser?.id){
            this.myGroupsList.push({
              id: groupsList.data[i].pk,
              name: groupsList.data[i].fields.name,
              location: groupsList.data[i].fields.location,
              isopen: groupsList.data[i].fields.isopen,
              maxsize: groupsList.data[i].fields.maxsize,
              dmneeded: groupsList.data[i].fields.dmneeded,
              description: groupsList.data[i].fields.description
            })
          } else {
            this.groupList.push({
              id: groupsList.data[i].pk,
              name: groupsList.data[i].fields.name,
              location: groupsList.data[i].fields.location,
              isopen: groupsList.data[i].fields.isopen,
              maxsize: groupsList.data[i].fields.maxsize,
              dmneeded: groupsList.data[i].fields.dmneeded,
              description: groupsList.data[i].fields.description
            })
          }  
        })
      };
    })
  }

  constructor() {
    this.loggedUser = this.UsersService.getLoggedInUser();
    this.GroupsService.getUserGroups(this.loggedUser!.id).subscribe((groupsList: any) => {
      for(let i = 0; i < groupsList.data.length; i++){
        this.GroupsService.getGroupOwner(groupsList.data[i].pk).subscribe((owner: any) => {
            if(owner.data[0].fields.userid === this.loggedUser?.id){
              this.myGroupsList.push({
                id: groupsList.data[i].pk,
                name: groupsList.data[i].fields.name,
                location: groupsList.data[i].fields.location,
                isopen: groupsList.data[i].fields.isopen,
                maxsize: groupsList.data[i].fields.maxsize,
                dmneeded: groupsList.data[i].fields.dmneeded,
                description: groupsList.data[i].fields.description
              })
            } else {
              this.groupList.push({
                id: groupsList.data[i].pk,
                name: groupsList.data[i].fields.name,
                location: groupsList.data[i].fields.location,
                isopen: groupsList.data[i].fields.isopen,
                maxsize: groupsList.data[i].fields.maxsize,
                dmneeded: groupsList.data[i].fields.dmneeded,
                description: groupsList.data[i].fields.description
              })
            }
            
        })
      };
      this.filteredList = this.groupList
      this.filteredmyGroupsList = this.myGroupsList
    });
  }
}
