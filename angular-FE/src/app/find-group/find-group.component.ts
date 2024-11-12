import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../user';
import { UsersService } from '../users.service';
import { Group } from '../group';
import { GroupsService } from '../groups.service';
import { GroupItemComponent } from '../group-item/group-item.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-find-group',
  standalone: true,
  imports: [RouterLink, GroupItemComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './find-group.component.html',
  styleUrl: './find-group.component.css'
})
export class FindGroupComponent {
  loggedUser?: User;

  UsersService: UsersService = inject(UsersService);

  GroupsService: GroupsService = inject(GroupsService);

  groupList: Group[] = [];

  createGroupForm = new FormGroup({
    name: new FormControl(''),
    location: new FormControl(''),
    isopen: new FormControl(false),
    description: new FormControl(''),
    maxsize: new FormControl(0),
    dmneeded: new FormControl(false),
  });

  createGroup(): void {
    this.GroupsService.createGroup(this.createGroupForm.value.name ?? '', this.createGroupForm.value.location ?? '', this.createGroupForm.value.isopen ?? false, this.createGroupForm.value.description ?? '', this.createGroupForm.value.maxsize ?? 0, this.createGroupForm.value.dmneeded ?? false);
    this.groupList.push({id: this.groupList.length+1 ,name: this.createGroupForm.value.name ?? '', location: this.createGroupForm.value.location ?? '', isopen: this.createGroupForm.value.isopen ?? false, description: this.createGroupForm.value.description ?? '', maxsize: this.createGroupForm.value.maxsize ?? 0, dmneeded: this.createGroupForm.value.dmneeded ?? false})
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
          dmneeded: groupsList.data[i].fields.dmneeded
        })
      };
    });
  }
}
