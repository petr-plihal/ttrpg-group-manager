<!-- src/views/CreateGroup.vue -->
<template>
    <Base>
        <template #navbar-buttons>
            <router-link to="/">Home</router-link>
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
                <p>Group created successfully!</p>
            </div>
        </template>
    </Base>
</template>

<script setup>
    /*curl -X POST http://127.0.0.1:8000/group/ \
        -H "Content-Type: application/json" \
        -d '{
            "name": "New Group",
            "description": "This is a new group.",
            "location": "Online",
            "isopen": true,
            "languages": "English",
            "maxsize": 10,
            "dmneeded": true,
            "gameid": 1,
            "groupchatcontent": "Welcome to the new group!"
        }'*/
    import { ref } from 'vue'
    import Base from '../components/Base.vue'
    import api from '../services/api'

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

    function submitForm() {
        api.createGroup(form.value)
            .then(response => {
                if (response.data.status === 'success') {
                    success.value = true
                    error.value = null
                } else {
                    error.value = response.data.message
                    success.value = false
                }
            })
            .catch(err => {
                error.value = err.message
                success.value = false
            })
    }
</script>

<style scoped>
/* Stylování pro CreateGroup.vue */
</style>