<!-- src/components/Navbar.vue -->
<template>
    <nav>
        <Sidebar ref="sidebar" />
        <router-link to="/">Domů</router-link>
        <router-link to="/create_group">Vytvoř skupinu</router-link>
    </nav>
    
</template>

<script setup>
    import { ref } from 'vue'
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