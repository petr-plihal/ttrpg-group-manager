<!-- src/views/Home.vue -->
<template>
    <Base>
        <template #navbar-buttons>
            <button @click="createGroup">Create Group</button>
        </template>
        <template #default>
            <div v-if="groups.length">
                <h2>Skupiny</h2>
                <ul>
                    <li v-for="group in groups" :key="group.pk">
                        <!--<p>ID: {{ group.pk }}</p>-->
                        <p><b>Název: </b>{{ group.fields.name }}</p>
                        <p>Popis: {{ group.fields.description }}</p>
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
    // curl -X GET http://localhost:8000/api/groups/
    import { ref, onMounted } from 'vue'
    import Base from '../components/Base.vue'
    import api from '../services/api'

    const groups = ref([])
    const error = ref(null)

    function fetchGroups() {
        api.getAllGroups()
            .then(response => {
                if (response.data.status === 'success') {
                    groups.value = response.data.data
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

    onMounted(fetchGroups)
</script>

<style scoped>
/* Stylování pro Home.vue */
</style>