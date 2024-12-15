<template>
    <Base>
        <template #navbar-buttons>
            <!-- <button @click="createGroup">Create Group</button> -->
        </template>
        <template #default>
            <div>
                <h2>Filtrujte skupiny</h2>
                <form @submit.prevent="filterGroups">
                    <div>
                        <label for="name">Název:</label>
                        <input type="text" id="name" v-model="filters.name">
                    </div>
                    <div>
                        <label for="location">Lokalita:</label>
                        <input type="text" id="location" v-model="filters.location">
                    </div>
                    <div>
                        <label for="isOpen">Otevřené:</label>
                        <input type="checkbox" id="isOpen" v-model="filters.isOpen">
                    </div>
                    <div>
                        <label for="languages">Jazyky:</label>
                        <input type="text" id="languages" v-model="filters.languages">
                    </div>
                    <div>
                        <label for="maxSize">Maximální velikost:</label>
                        <input type="number" id="maxSize" v-model="filters.maxSize">
                    </div>
                    <div>
                        <label for="dmNeeded">Potřebuje DM:</label>
                        <input type="checkbox" id="dmNeeded" v-model="filters.dmNeeded">
                    </div>
                    <div>
                        <label for="game">Hra:</label>
                        <input type="text" id="game" v-model="filters.game">
                    </div>
                    <button type="submit">Filtrovat</button>
                </form>
            </div>
            <div v-if="groups.length">
                <h2>Skupiny</h2>
                <ul>
                    <li v-for="group in groups" :key="group.pk">
                        <p><b>Název: </b> <a :href="'/group/' + group.pk + '/lobby'">{{ group.fields.name }}</a> </p>
                        <p>Popis: {{ group.fields.description }}</p>
                        <p>Lokace: {{ group.fields.location }}</p>
                        <p>Otevřené: {{ group.fields.isopen ? 'Ano' : 'Ne' }}</p>
                        <p>Jazyk: {{ group.fields.languages }}</p>
                        <p>Maximální velikost: {{ group.fields.maxsize }}</p>
                        <p>Potřebuje DM: {{ group.fields.dmneeded ? 'Ano' : 'Ne' }}</p>
                        <p>Hra: {{ group.fields.game }}</p>
                        <p v-if="group.tags && group.tags.length">
                            <b>Tagy:</b>
                            <span v-for="tag in group.tags" :key="tag.pk">{{ tag.fields.name }}</span>
                        </p>
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

const groups = ref([])
const error = ref(null)
const filters = ref({
    name: '',
    location: '',
    isOpen: false,
    languages: '',
    maxSize: null,
    dmNeeded: false,
    game: ''
})

function fetchGroups() {
    api.getAllGroups()
        .then(response => {
            if (response.data.status === 'success') {
                const groupData = response.data.data
                const tagPromises = groupData.map(async group => {
                    try {
                        const tagsResponse = await api.getGroupTags(group.pk)
                        group.tags = tagsResponse.data.data
                    } catch (err) {
                        group.tags = []
                    }
                })
                Promise.all(tagPromises).then(() => {
                    groups.value = groupData
                })
                error.value = null
            } else {
                error.value = response.data.message
                groups.value = []
            }
        })
        .catch(err => {
            error.value = err.message
            groups.value = []
        })
}

async function filterGroups() {
    try {
        if (filters.value.name) {
            const response = await api.getGroupByName(filters.value.name)
            groups.value = response.data.data
        } else if (filters.value.isOpen) {
            const response = await api.getOpenGroups()
            groups.value = response.data.data
        } else if (filters.value.languages) {
            const response = await api.getGroupByLanguage(filters.value.languages)
            groups.value = response.data.data
        } else if (filters.value.dmNeeded) {
            const response = await api.getGroupWithoutDM()
            groups.value = response.data.data
        } else if (filters.value.game) {
            const response = await api.getGroupByGame(filters.value.game)
            groups.value = response.data.data
        } else {
            fetchGroups()
        }
        error.value = null
    } catch (err) {
        error.value = err.message
        groups.value = []
    }
}

onMounted(fetchGroups)
</script>

<style scoped>
/* Stylování pro GroupSearch.vue */
</style>