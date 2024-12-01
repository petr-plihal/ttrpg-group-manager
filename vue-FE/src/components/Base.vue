<!-- src/components/BaseLayout.vue -->
<template>
    <div>
        <Navbar>
            <slot name="navbar-buttons"></slot>
        </Navbar>
        <main>
            <slot></slot>
        </main>
        
    </div>
</template>

<!-- setup zařídí automatický export komponenty -> není třeba manuálně dělat export default...-->
<script setup>
    import Navbar from './Navbar.vue'
</script>

<style scoped>
    /* Stylování pro Base.vue */
</style>