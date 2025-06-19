<template>
    <Base>
        <template #navbar-buttons>
            <!-- <button @click="createGroup">Create Group</button> -->
        </template>
        <template #default>
            <div v-if="currentUser && groups.length">
                <h2>Moje skupiny</h2>
                <ul>
                    <li v-for="group in groups" :key="group.pk">
                        <a :href="'/group/' + group.pk + '/lobby'"> <b>Název: </b>{{ group.fields.name }} </a>
                        <p v-if="group.nickname">Přezdívka: {{ group.nickname }}</p>
                    </li>
                </ul>
            </div>
            <div v-if="error">
                <p>Error: {{ error }}</p>
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

const groups = ref([])
const error = ref(null)

async function fetchUserGroups() {
    if (currentUser) {
        try {
            const response = await api.getUserGroups(currentUser.pk)
            if (response.data.status === 'success') {
                const groupData = response.data.data
                for (const group of groupData) {
                    try {
                        const nicknameResponse = await api.getUserGroupNickname(currentUser.pk, group.pk)
                        group.nickname = nicknameResponse.data
                    } catch (err) {
                        group.nickname = null
                    }
                }
                groups.value = groupData
                error.value = null
            } else {
                error.value = response.data.message
                groups.value = []
            }
        } catch (err) {
            error.value = err.message
            groups.value = []
        }
    }
}

onMounted(fetchUserGroups)
</script>

<style scoped>
/* Stylování pro Home.vue */
</style>