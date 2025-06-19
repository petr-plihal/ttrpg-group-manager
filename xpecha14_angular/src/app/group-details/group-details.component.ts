import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule, NgFor } from '@angular/common';
import { Group } from '../group';
import { GroupsService } from '../groups.service';
import { User } from '../user';
import { BelongsTo } from '../belongs-to';
import { UsersService } from '../users.service';
import { catchError, Observable } from 'rxjs';
import { TagsService } from '../tags.service';
import { Tag } from '../tag';
import { LoginButton } from '../login-button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Router} from "@angular/router"

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [MenuComponent, CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css'
})
export class GroupDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  groupId: number = -1;

  GroupsService: GroupsService = inject(GroupsService);
  UsersService: UsersService = inject(UsersService);
  TagsService: TagsService = inject(TagsService);

  groupDetail?: Group;

  playerList: BelongsTo[] = []

  tagsList: Tag[] = []

  loggedUser?: User;

  isMember: boolean = false;

  descriptionForm = new FormGroup({
    description: new FormControl('') 
  }) 

  isOwner: boolean = false;
  
  errorMsg: string = '';

  backupDescription: string = '';

  applyToGroup() {
    this.errorMsg = '';
    this.GroupsService.applyToGroup(this.groupDetail!.id, this.loggedUser!.id).subscribe(response => {
      if(response.status === 'info'){
        this.errorMsg = 'You have already applied for this group'
      }
      this.errorMsg = 'Application sent!'
    })
  }

  leaveGroup() {
    this.GroupsService.leaveGroup(this.loggedUser!.id, this.groupDetail!.id).subscribe(
      result => {
        this.router.navigate(['/landingPage'])
      }
    )
  }

  deleteGroup() {
    this.GroupsService.deleteGroup(this.groupDetail!.id).subscribe(
      result => {
        this.router.navigate(['/landingPage'])
      }
    )
  }

  editDesc(){
    if(this.groupDetail != undefined){
      this.backupDescription = this.groupDetail!.description ?? ''
      this.groupDetail!.description = this.descriptionForm.value.description!
      this.GroupsService.updateGroup(this.groupDetail).pipe(catchError(err => {
        this.groupDetail!.description = this.backupDescription;
        throw 'error: ' + err.error.message
      })).subscribe(results => {})
    }
  }

  toggleIsOpen() {
    if(this.groupDetail != undefined){
      this.groupDetail.isopen = !this.groupDetail?.isopen;
      this.GroupsService.updateGroup(this.groupDetail).pipe(catchError(err => {
        this.groupDetail!.isopen = !this.groupDetail?.isopen;
        throw 'error: ' + err.error.message
      }))
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
          isowner: BelongsTo.data[i].fields.isowner,
          nickname: BelongsTo.data[i].fields.nickname,
        })
        //if the user doesnt have a nickname then use their username
        if(this.playerList[i].nickname === undefined || this.playerList[i].nickname === null || this.playerList[i].nickname === ''){
          this.UsersService.getUserById(this.playerList[i].userid).subscribe(User => {
            this.playerList[i].nickname = User.data[0].fields.username
          }
          )
        }
        if(this.playerList[i].userid === this.loggedUser?.id){
          this.isMember = true
          if(this.playerList[i].isowner){
            this.isOwner = true
          }
        }
      }
      
    })
  }

  constructor(private router: Router) {
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
      this.descriptionForm.setValue({description: Group.data[0].fields.description})
    })
    this.TagsService.getGroupTags(this.groupId).subscribe((Tags: any) => {
      for(let i = 0; i < Tags.data.length; i++){
        this.tagsList.push({
          name: Tags.data[i].fields.name
        })
      }
    })
    this.loggedUser = this.UsersService.getLoggedInUser()
  }
}
