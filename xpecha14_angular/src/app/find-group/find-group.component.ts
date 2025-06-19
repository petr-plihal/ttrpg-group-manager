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
@Component({
  selector: 'app-find-group',
  standalone: true,
  imports: [RouterLink, GroupItemComponent, CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './find-group.component.html',
  styleUrl: './find-group.component.css'
})
export class FindGroupComponent {
  loggedUser?: User;

  UsersService: UsersService = inject(UsersService);

  GroupsService: GroupsService = inject(GroupsService);

  groupList: Group[] = [];

  filteredList: Group[] = [];

  searchGroupName = new FormControl('');

  searchGroup(): void {
    this.filteredList = [];
    for(let i = 0; i < this.groupList.length; i++){    
      if(this.groupList[i].name.includes(this.searchGroupName.value ?? '')){
        this.filteredList.push(this.groupList[i])
      }
    }
  }

  constructor() {
    this.loggedUser = this.UsersService.getLoggedInUser();
    this.GroupsService.getAllGroups().subscribe((groupsList: any) => {
      for(let i = 0; i < groupsList.data.length; i++){
        this.groupList.push({
          id: groupsList.data[i].pk,
          name: groupsList.data[i].fields.name,
          location: groupsList.data[i].fields.location,
          isopen: groupsList.data[i].fields.isopen,
          maxsize: groupsList.data[i].fields.maxsize,
          dmneeded: groupsList.data[i].fields.dmneeded,
          description: groupsList.data[i].fields.description
        })
      };
      this.filteredList = this.groupList
    });
  }
}
