<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="group-edit">
                <div v-if="isOwner">
                    <h2>Upravit skupinu</h2>
                    <form @submit.prevent="updateGroup">
                        <label for="name">Název skupiny:</label>
                        <input type="text" id="name" v-model="groupName" />

                        <label for="description">Popis:</label>
                        <textarea id="description" v-model="groupDescription"></textarea>

                        <label for="location">Místo:</label>
                        <input type="text" id="location" v-model="groupLocation" />

                        <label for="languages">Jazyky:</label>
                        <input type="text" id="languages" v-model="groupLanguages" />

                        <label for="maxsize">Maximální velikost:</label>
                        <input type="number" id="maxsize" v-model="groupMaxSize" />

                        <label for="dmneeded">Potřebuje DM:</label>
                        <input type="checkbox" id="dmneeded" v-model="groupDMNeeded" />

                        <button type="submit">Uložit změny</button>
                    </form>
                    <button @click="deleteGroup" class="delete-button">Smazat skupinu</button>
                </div>
                <div v-else>
                    <p>Nemáte oprávnění upravovat tuto skupinu.</p>
                </div>
            </div>
        </template>
    </Base>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Base from '../components/Base.vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id

const userStore = useUserStore()
const currentUser = userStore.currentUser

const groupName = ref('')
const groupDescription = ref('')
const groupLocation = ref('')
const groupLanguages = ref('')
const groupMaxSize = ref(0)
const groupDMNeeded = ref(false)
const isOwner = ref(false)

async function fetchGroupData() {
    try {
        const groupResponse = await api.getGroup(groupId)
        const groupData = groupResponse.data.fields

        groupName.value = groupData.name
        groupDescription.value = groupData.description
        groupLocation.value = groupData.location
        groupLanguages.value = groupData.languages
        groupMaxSize.value = groupData.maxsize
        groupDMNeeded.value = groupData.dmneeded

        const ownerResponse = await api.getGroupOwner(groupId)
        isOwner.value = ownerResponse.data.data.some(owner => owner.fields.userid === currentUser.pk && owner.fields.isowner)
    } catch (error) {
        console.error('Error fetching group data:', error)
    }
}

async function updateGroup() {
    try {
        const updatedData = {
            name: groupName.value,
            description: groupDescription.value,
            location: groupLocation.value,
            languages: groupLanguages.value,
            maxsize: groupMaxSize.value,
            dmneeded: groupDMNeeded.value
        }
        await api.updateGroup(groupId, updatedData)
        alert('Skupina byla úspěšně aktualizována.')
        router.push(`/group/${groupId}/lobby`)
    } catch (error) {
        console.error('Error updating group:', error)
        alert('Chyba při aktualizaci skupiny.')
    }
}

async function deleteGroup() {
    if (confirm('Opravdu chcete smazat tuto skupinu?')) {
        try {
            await api.deleteGroup(groupId)
            alert('Skupina byla úspěšně smazána.')
            router.push('/')
        } catch (error) {
            console.error('Error deleting group:', error)
            alert('Chyba při mazání skupiny.')
        }
    }
}

onMounted(fetchGroupData)
</script>

<style scoped>
.group-edit {
    padding: 1rem;
}

.group-edit h2 {
    margin-top: 1rem;
}

.group-edit form {
    display: flex;
    flex-direction: column;
}

.group-edit form label {
    margin-top: 0.5rem;
}

.group-edit form input,
.group-edit form textarea {
    margin-bottom: 0.5rem;
}

.group-edit form button {
    margin-top: 1rem;
}

.delete-button {
    margin-top: 1rem;
    background-color: red;
    color: white;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
}

.delete-button:hover {
    background-color: darkred;
}
</style>