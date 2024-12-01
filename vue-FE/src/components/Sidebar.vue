<!-- src/components/Sidebar.vue -->
<template>
    <div>
        <button @click="toggleSidebar" class="sidebar-toggle">☰</button>
        <b-offcanvas v-model="isOpen" title="">
            
            <!-- Další odkazy zde -->
        </b-offcanvas>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function toggleSidebar() {
    isOpen.value = !isOpen.value
}
</script>

<style scoped>
.sidebar-toggle {
    text-decoration: none;
    color: #42b983;
    font-size: 1.5em;
    background: none;
    border: none;
    cursor: pointer;
}
.sidebar-toggle:hover {
    color: #2c8c6b;
}
</style>