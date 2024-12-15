<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="user-profile">
                <div v-if="userExists">
                    <h2 v-if="isCurrentUser">Můj profil</h2>
                    <h2 v-else>Profil uživatele {{ userName }}</h2>
                    <div>
                        <img :src="userProfilePicture" alt="Profile Picture" />
                        <p><strong>Uživatelské jméno:</strong> {{ userName }}</p>
                        <p><strong>Popis:</strong> {{ userDescription }}</p>
                        <p><strong>Může být DM:</strong> {{ userCanDM ? 'Ano' : 'Ne' }}</p>
                    </div>
                    <div v-if="isCurrentUser">
                        <h3>Upravit profil</h3>
                        <form @submit.prevent="updateProfile">
                            <label for="username">Uživatelské jméno:</label>
                            <input type="text" id="username" v-model="editUserName" />

                            <label for="description">Popis:</label>
                            <textarea id="description" v-model="editUserDescription"></textarea>

                            <label for="candm">Může být DM:</label>
                            <input type="checkbox" id="candm" v-model="editUserCanDM" />

                            <button type="submit">Uložit změny</button>
                        </form>
                    </div>
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
import api from '../services/api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const userId = route.params.id

const userStore = useUserStore()
const currentUser = userStore.currentUser

const userName = ref('')
const userProfilePicture = ref('')
const userDescription = ref('')
const userCanDM = ref(false)
const isCurrentUser = ref(false)
const userExists = ref(true)

const editUserName = ref('')
const editUserDescription = ref('')
const editUserCanDM = ref(false)

async function fetchUserData() {
    try {
        const userResponse = await api.getUser(userId)
        console.log('User response:', userResponse.data)
        if (userResponse.data && userResponse.data.fields) {
            const userData = userResponse.data.fields
            userName.value = userData.username
            userProfilePicture.value = userData.profilepicture
            userDescription.value = userData.description
            userCanDM.value = userData.candm

            editUserName.value = userData.username
            editUserDescription.value = userData.description
            editUserCanDM.value = userData.candm

            isCurrentUser.value = currentUser.pk == userId
            userExists.value = true
        } else {
            userExists.value = false
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            userExists.value = false
        } else {
            console.error('Error fetching user data:', error)
        }
    }
}

async function updateProfile() {
    try {
        const updatedData = {
            username: editUserName.value,
            description: editUserDescription.value,
            candm: editUserCanDM.value
        }
        await api.updateUser(userId, updatedData)
        userName.value = updatedData.username
        userDescription.value = updatedData.description
        userCanDM.value = updatedData.candm
        alert('Profil byl úspěšně aktualizován.')
    } catch (error) {
        console.error('Error updating profile:', error)
        alert('Chyba při aktualizaci profilu.')
    }
}

onMounted(fetchUserData)
</script>

<style scoped>
.user-profile {
    padding: 1rem;
}

.user-profile h2 {
    margin-top: 1rem;
}

.user-profile img {
    max-width: 150px;
    border-radius: 50%
}

.user-profile form {
    display: flex;
    flex-direction: column;
}

.user-profile form label {
    margin-top: 0.5rem;
}

.user-profile form input,
.user-profile form textarea {
    margin-bottom: 0.5rem;
}

.user-profile form button {
    margin-top: 1rem;
}
</style>