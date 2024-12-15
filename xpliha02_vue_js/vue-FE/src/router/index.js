import { createRouter, createWebHistory } from 'vue-router'

import ChangeUser from '../views/ChangeUser.vue'
import UserProfile from '../views/UserProfile.vue'
import UserApplications from '../views/UserApplications.vue'
import UserSchedule from '../views/UserSchedule.vue'
import UserGroupsOwned from '../views/UserGroupsOwned.vue'

import Home from '../views/Home.vue'
import GroupSearch from '../views/GroupSearch.vue'
import GroupLobby from '../views/GroupLobby.vue'
import GroupCreate from '../views/GroupCreate.vue'
import GroupEdit from '../views/GroupEdit.vue'

import TestComponent from '../views/TestComponent.vue'

const routes = [
    {
        path: '/change_user',
        name: 'ChangeUser',
        component: ChangeUser,
    },
    {
        path: '/user/:id/profile',
        name: 'UserProfile',
        component: UserProfile,
    },
    {
        path: '/user/:id/applications',
        name: 'UserApplications',
        component: UserApplications,
    },
    {
        path: '/user/:id/schedule',
        name: 'UserSchedule',
        component: UserSchedule,
    },
    {
        path : '/user/groups_owned',
        name : 'UserGroupsOwned',
        component : UserGroupsOwned,
    },

    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/group/create',
        name: 'GroupCreate',
        component: GroupCreate,
    },
    {
        path: '/group_search',
        name: 'GroupSearch',
        component: GroupSearch,
    },
    {
        path: '/group/:id/lobby',
        name: 'GroupLobby',
        component: GroupLobby,
    },
    {
        path: '/group/:id/edit',
        name: 'GroupEdit',
        component: GroupEdit,
    },
    {
        path: '/test',
        name: 'TestComponent',
        component: TestComponent,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router