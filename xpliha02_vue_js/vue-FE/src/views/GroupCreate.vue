<template>
    <Base>
        <template #navbar-buttons>
            <!-- <router-link to="/">Home</router-link> -->
        </template>
        <template #default>
            <h1>Vytvoř skupinu</h1>
            <form @submit.prevent="submitForm">
                <div>
                    <label for="name">Název:</label>
                    <input type="text" id="name" v-model="form.name" required>
                </div>
                <div>
                    <label for="description">Popis:</label>
                    <input type="text" id="description" v-model="form.description" required>
                </div>
                <div>
                    <label for="location">Lokace:</label>
                    <input type="text" id="location" v-model="form.location" required>
                </div>
                <div>
                    <label for="isopen">Přijímá členy?:</label>
                    <input type="checkbox" id="isopen" v-model="form.isopen">
                </div>
                <div>
                    <label for="languages">Jazyk:</label>
                    <input type="text" id="languages" v-model="form.languages" required>
                </div>
                <div>
                    <label for="maxsize">Maximální počet hráčů:</label>
                    <input type="number" id="maxsize" v-model="form.maxsize" required>
                </div>
                <div>
                    <label for="dmneeded">Hledá se DM?:</label>
                    <input type="checkbox" id="dmneeded" v-model="form.dmneeded">
                </div>
                <div>
                    <!--
                    <label for="gameid">Game ID:</label>
                    <input type="number" id="gameid" v-model="form.gameid" required>
                    -->
                </div>
                <button type="submit">Create Group</button>
            </form>
            <div v-if="error">
                <p>Error: {{ error }}</p>
            </div>
            <div v-if="success">
                <p>Skupina úspěšně vytvořena!</p>
            </div>
        </template>
    </Base>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Base from '../components/Base.vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const currentUser = userStore.currentUser

const form = ref({
    name: '',
    description: '',
    location: '',
    isopen: false,
    languages: '',
    maxsize: 1,
    dmneeded: false,
    gameid: 1,
    groupchatcontent: ''
})

const error = ref(null)
const success = ref(false)

async function submitForm() {
    try {
        const response = await api.createGroup(form.value)
        console.log('Create group response:', response.data)

        if (response.data.status === 'success') {
            console.log('Group data:', response.data.groupid)
            const groupId = response.data.groupid
            await api.setGroupOwner(groupId, { user_id: currentUser.pk })

            console.log('Group owner set')

            success.value = true
            error.value = null
            router.push(`/group/${groupId}/lobby`)
        } else {
            error.value = response.data.message
            success.value = false
        }
    } catch (err) {
        console.error('Error creating group:', err)
        error.value = err.message
        success.value = false
    }
}
</script>

<style scoped>
/* Stylování pro CreateGroup.vue */
</style>