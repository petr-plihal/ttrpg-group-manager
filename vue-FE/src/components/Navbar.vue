<!-- src/components/Navbar.vue -->
<template>
    <nav>
        <Sidebar ref="sidebar" />
        <router-link to="/">Domů</router-link>
        <!--<router-link to="/create_group">Vytvoř skupinu</router-link>-->
        <router-link to="/group_search">Vyhledat skupiny</router-link>
        <router-link :to="`/user/${currentUserId}/applications`">Moje žádosti</router-link>
        <!--<router-link :to="`/user/${currentUserId}/schedule`">Rozvrh</router-link>-->

        <router-link to="/group/create">Vytvořit skupinu</router-link>
        <router-link to="/user/groups_owned">Mé spravované skupiny</router-link>
        
        <router-link :to="`/user/${currentUserId}/profile`">Profil</router-link>
        <router-link to="/change_user">Přepnout uživatele</router-link>

        <slot></slot>
    </nav>
    
</template>

<script setup>
    import { ref } from 'vue'
    
    import { useUserStore } from '../stores/user'
    const userStore = useUserStore()
    const currentUser = userStore.currentUser
    const currentUserId = currentUser ? currentUser.pk : null
    
    import Sidebar from './Sidebar.vue'
    const sidebar = ref(null)
    function toggleSidebar() {
        sidebar.value.toggleSidebar()
    }
</script>

<style scoped>
    nav {
        padding: 1em;
        display: flex;
        align-items: center;
    }
    nav a, nav button {
        margin: 0 1em;
        text-decoration: none;
        color: #42b983;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1em;
    }
    nav a.router-link-exact-active {
        font-weight: bold;
    }
</style>