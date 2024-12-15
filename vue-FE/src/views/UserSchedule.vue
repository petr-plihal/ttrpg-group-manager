<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="user-schedule">
                <div v-if="userExists">
                    <h2 v-if="isCurrentUser">Moje volné časové bloky</h2>
                    <h2 v-else>{{ userName }}'s volné časové bloky</h2>
                    <ul>
                        <li v-for="block in schedule" :key="block.pk">
                            {{ block.fields.day }}: {{ block.fields.starttime }} - {{ block.fields.endtime }}
                        </li>
                    </ul>

                    <h2>Kalendář sezení</h2>
                    <Calendar :events="calendarEvents" />
                </div>
                <div v-else>
                    <p>Uživatel s ID {{ userId }} neexistuje.</p>
                </div>
            </div>
        </template>
    </Base>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Base from '../components/Base.vue'
import Calendar from '../components/Calendar.vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const userId = route.params.id

const userStore = useUserStore()
const currentUser = userStore.currentUser

const schedule = ref([])
const sessions = ref([])
const userName = ref('')
const isCurrentUser = ref(false)
const userExists = ref(true)
const calendarEvents = ref([])

async function fetchUserData() {
    try {
        const userResponse = await api.getUser(userId)
        userName.value = userResponse.data.fields.username
        userExists.value = true

        const scheduleResponse = await api.getUserSchedule(userId)
        schedule.value = scheduleResponse.data.data

        isCurrentUser.value = currentUser.pk == userId

        const groupsResponse = await api.getUserGroups(userId)
        const groupIds = groupsResponse.data.data.map(group => group.pk)

        const sessionPromises = groupIds.map(groupId => api.getGroupSessions(groupId))
        const sessionResponses = await Promise.all(sessionPromises)
        sessions.value = sessionResponses.flatMap(response => response.data.data)

        // Převod sessions na formát událostí pro FullCalendar
        calendarEvents.value = sessions.value.map(session => ({
            title: session.fields.description,
            start: session.fields.starttime,
            end: new Date(new Date(session.fields.starttime).getTime() + session.fields.duration * 60000).toISOString()
        }))
    } catch (error) {
        if (error.response && error.response.status === 404) {
            userExists.value = false
        } else {
            console.error('Error fetching user data:', error)
        }
    }
}

onMounted(fetchUserData)
</script>

<style scoped>
.user-schedule {
    padding: 1rem;
}

.user-schedule h2 {
    margin-top: 1rem;
}

.user-schedule ul {
    list-style-type: none;
    padding: 0;
}

.user-schedule li {
    margin-bottom: 0.5rem;
}
</style>