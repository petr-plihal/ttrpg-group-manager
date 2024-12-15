<template>
    <FullCalendar
        :events="events"
        :initialView="'dayGridMonth'"
        @dateClick="handleDateClick"
        :plugins="[dayGridPlugin, timeGridPlugin]"
    />
</template>

<script setup>
import { ref, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

const props = defineProps({
    events: {
        type: Array,
        required: true
    }
})

const handleDateClick = (info) => {
    console.log('Date clicked:', info.dateStr)
    // Můžete přidat další logiku pro zpracování kliknutí na datum
}
</script>

<style scoped>
/* Stylování pro Calendar.vue */
</style>