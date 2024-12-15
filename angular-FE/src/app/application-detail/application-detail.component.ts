import { Component, inject, Input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { Application } from '../application';
import { Group } from '../group';
import { User } from '../user';
import { UsersService } from '../users.service';
import { GroupsService } from '../groups.service';
import { ApplicationService } from '../application-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent {
  applicationDetail?: Application;
  group?: Group;
  user?: User;

  isOwner: boolean;

  applicationId: Number;

  route: ActivatedRoute = inject(ActivatedRoute);

  userService: UsersService = inject(UsersService)
  groupService: GroupsService = inject(GroupsService)
  applicationService: ApplicationService = inject(ApplicationService)

  accept(){
    this.applicationService.acceptInvite(this.applicationDetail!.id).pipe(catchError(err => {
      throw 'error: ' + err.error.message
    })).subscribe(results => {
      this.router.navigate(['/landingPage'])
    })
  }

  deny(){
    this.applicationService.denyInvite(this.applicationDetail!.id).pipe(catchError(err => {
      throw 'error: ' + err.error.message
    })).subscribe(results => {
      this.router.navigate(['/landingPage'])
    })
  }

  constructor(private router: Router) {
    this.applicationId = Number(this.route.snapshot.params['id'])
    if(Number(this.route.snapshot.params['owner']) === 0){
      this.isOwner = false
    } else {
      this.isOwner = true
    }
    console.log(this.isOwner)
    this.applicationService.getAppById(this.applicationId).subscribe(appResult => {
      this.applicationDetail = {
        id: appResult.data[0].pk,
        applicantid: appResult.data[0].fields.applicantid,
        groupid: appResult.data[0].fields.groupid
      }
      this.groupService.getGroupById(this.applicationDetail.groupid).subscribe(Group => {
        this.group = {
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
      this.userService.getUserById(appResult.data[0].fields.applicantid).subscribe(User => {
        this.user = {
          id: User.data[0].pk,
          username: User.data[0].fields.username,
          profilepicture: User.data[0].fields.profilepicture.replace('<URL>','.') ?? ''
        }
      })
    })
  }
}
