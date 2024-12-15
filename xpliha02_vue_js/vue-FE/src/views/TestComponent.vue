<!-- src/views/TestComponent.vue -->
<template>
    <Base>
        <template #navbar-buttons>
            <!-- Buttons for navigation to page-specific pages -->
        </template>
        <template #default>
            <!-- Page-specific content -->
        </template>
    </Base>
</template>
  
<script setup>
    import Base from '../components/Base.vue' // Základní layout stránky

    import api from '../services/api' // Funkce pro komunikaci s API (např. fetchování dat, odesílání formulářů)

    import { ref ,onMounted } from 'vue' // Vytváření reaktivních proměnných (referencí) - automatické překreslování komponenty při změně hodnoty proměnné + lifecycle hook onMounted - spustí kód při načtení komponenty

    import { useUserStore } from '../stores/user' // Store pro uživatele - obsahuje informace o aktuálně přihlášeném uživateli
    const userStore = useUserStore() // Použití store pro uživatele
    const currentUser = userStore.currentUser // Aktuálně přihlášený uživatel

    import { useToast } from 'vue-toastification' // Toasty - zobrazování upozornění
    const toast = useToast() // Použití toastů
</script>