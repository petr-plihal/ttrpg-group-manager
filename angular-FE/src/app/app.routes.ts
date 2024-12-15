import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FindGroupComponent } from './find-group/find-group.component';
import { FindPlayersComponent } from './find-players/find-players.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { AppComponent } from './app.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';


export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        title: 'Login page'
    },
    {
        path: 'landingPage',
        component: LandingPageComponent,
        title: 'Landing page'
    },
    {
        path: 'findGroup',
        component: FindGroupComponent,
        title: 'Find Group'
    },
    {
        path: 'findPlayers',
        component: FindPlayersComponent,
        title: 'Find Players'
    },
    {
        path: 'findPlayers/playerDetail/:id',
        component: PlayerDetailsComponent,
        title: 'Player details'
    },
    {
        path: 'findGroup/groupDetail/:id',
        component: GroupDetailsComponent,
        title: 'Group details'
    },
    {
        path: 'myGroups',
        component: MyGroupsComponent,
        title: 'My gorup'
    },
    {
        path: 'myGroups/groupDetail/:id',
        component: GroupDetailsComponent,
        title: 'Group details'
    },
    {
        path: 'myApps',
        component: MyApplicationsComponent,
        title: 'My applications'
    },
    {
        path: 'myApps/:id',
        component: ApplicationDetailComponent,
        title: 'Application detail'
    }
];
