import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import CreateGroup from '../views/CreateGroup.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/create_group',
        name: 'CreateGroup',
        component: CreateGroup,
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router