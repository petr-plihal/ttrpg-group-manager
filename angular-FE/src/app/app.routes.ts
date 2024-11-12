import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FindGroupComponent } from './find-group/find-group.component';
import { FindPlayersComponent } from './find-players/find-players.component';


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
    }
];
