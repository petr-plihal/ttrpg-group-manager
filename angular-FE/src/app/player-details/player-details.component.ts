import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';
import { catchError, Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tag } from '../tag';
import { TagsService } from '../tags.service';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [MenuComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css'
})
export class PlayerDetailsComponent {
  userDetail?: User;
  route: ActivatedRoute = inject(ActivatedRoute);
  playerId = -1;
  description: string = '';
  isLogged: boolean = false;
  profilePic: string = '';
  backupDescription: string = '';

  avoidTags: Tag[] = []
  lookingTags: Tag[] = []

  profilePictureForm = new FormGroup({
    newProfilePic: new FormControl('')
  })
  


  descriptionForm = new FormGroup({
    description: new FormControl('') 
  }) 

  UsersService: UsersService = inject(UsersService);

  tagService: TagsService = inject(TagsService);

  editDesc(){
    if(this.userDetail != undefined){
      this.backupDescription = this.userDetail!.description ?? ''
      this.userDetail!.description = this.descriptionForm.value.description!
      this.UsersService.editUser(this.userDetail!).pipe(catchError(err => {
        this.userDetail!.description = this.backupDescription;
        throw 'error: ' + err.error.message
      })).subscribe(result => {
        console.log(result)
      });
    }
  }

  editProfilePicture(){
    if(this.userDetail != undefined){
      this.backupDescription = this.userDetail!.profilepicture ?? ''
      this.userDetail!.profilepicture = this.profilePictureForm.value.newProfilePic ?? ''
      this.UsersService.editUser(this.userDetail!).pipe(catchError(err => {
        this.userDetail!.profilepicture = this.backupDescription;
        throw 'error: ' + err.error.message
      })).subscribe(result => {
        this.profilePic = this.userDetail!.profilepicture ?? ''
        console.log(result)
      });
    }
  }

  constructor() {
    this.playerId = Number(this.route.snapshot.params['id'])
    this.isLogged = this.playerId === this.UsersService.getLoggedInUser()?.id
    this.UsersService.getUserById(this.playerId).subscribe((User: any) => {
      this.userDetail = {
        id: User.data[0].pk,
        username: User.data[0].fields.username,
        profilepicture: User.data[0].fields.profilepicture,
        description: User.data[0].fields.description,
        candm: User.data[0].fields.candm
      }
      this.tagService.getUserLookingTags(this.userDetail!.id).subscribe(tags => {
        for(let i = 0; i < tags.data.length; i++){
            this.lookingTags.push({
              name: tags.data[i].fields.name
            }
          )
        }
      })
      this.tagService.getUserAvoidTags(this.userDetail!.id).subscribe(tags => {
        for(let i = 0; i < tags.data.length; i++){
            this.avoidTags.push({
              name: tags.data[i].fields.name
            }
          )
        }
      })
      this.profilePic = this.userDetail.profilepicture!.replace('<URL>','.');
      this.descriptionForm.setValue({description: User.data[0].fields.description})
      this.profilePictureForm.setValue({newProfilePic: User.data[0].fields.profilepicture})
    })
    
  }
}
