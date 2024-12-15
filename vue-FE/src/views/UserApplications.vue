<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="user-applications">
                <h2>Moje žádosti</h2>
                <ul v-if="applications.length">
                    <li v-for="application in applications" :key="application.pk">
                        <p><strong>Skupina:</strong> <a :href="'/group/' + application.fields.groupid + '/lobby'">{{ application.fields.group_name }}</a></p>
                        <p><strong>Popis:</strong> {{ application.fields.description }}</p>
                    </li>
                </ul>
                <p v-else>Nemáte žádné žádosti.</p>
            </div>
        </template>
    </Base>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Base from '../components/Base.vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const currentUser = userStore.currentUser

const applications = ref([])

async function fetchUserApplications() {
    try {
        const response = await api.getUserApplications(currentUser.pk)
        applications.value = response.data.data
    } catch (error) {
        console.error('Error fetching user applications:', error)
    }
}

onMounted(fetchUserApplications)
</script>

<style scoped>
.user-applications {
    padding: 1rem;
}

.user-applications h2 {
    margin-top: 1rem;
}

.user-applications ul {
    list-style-type: none;
    padding: 0;
}

.user-applications li {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>