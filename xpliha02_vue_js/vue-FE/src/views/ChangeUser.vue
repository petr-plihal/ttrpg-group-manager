<!-- src/views/ChangeUser.vue -->
<template>
    <Base>
        <template #navbar-buttons>
            <!-- Links specific to this page -->
        </template>

        <template #default>
            <h1>Select User</h1>

            <div v-if="currentUser">
                <p>Current User: {{ currentUser.fields.username }} (PK: {{ currentUser.pk }})</p>
                <button @click="logout">Logout</button>
            </div>
            <div v-else>
                <p>No user is currently logged in.</p>
            </div>

            <div v-for="user in users" :key="user.pk">
                <label>
                    <input
                    type="radio"
                    name="user"
                    :value="user.pk"
                    v-model="selectedUser"
                    />
                    {{ user.fields.username }} (PK: {{ user.pk }})
                </label>
            </div>
            <button @click="confirmUser">Confirm</button>
            <div v-if="error">
                <p>Error: {{ error }}</p>
            </div>
        </template>
    </Base>
</template>

<script setup>
    import Base from '../components/Base.vue'
    import api from '../services/api' // API service
    import { ref, onMounted } from 'vue' //

    import { useUserStore } from '../stores/user'
    const userStore = useUserStore()
    const currentUser = userStore.currentUser

    import { useToast } from 'vue-toastification'
    const toast = useToast()

    const users = ref([])
    const selectedUser = ref(null)
    const error = ref(null)

    function fetchUsers() {
        api.getAllUsers()
            .then(response => {
                if (response.data.status === 'success') {
                    users.value = response.data.data
                    error.value = null
                } else {
                    error.value = response.data.message
                    users.value = []
                }
            })
            .catch(err => {
                error.value = err.message
                users.value = []
            })
    }

    function confirmUser() {
        const user = users.value.find(u => u.pk === selectedUser.value)
        if (user) {
            userStore.setUser(user)
            console.log('Selected user:', user)
            //window.location.reload() // Refresh the page after confirming the user
            toast.success('Successfully logged in as ' + user.fields.username)
        }
    }

    function logout() {
        userStore.clearUser()
        console.log('User logged out')
        //window.location.reload() // Refresh the page after logging out
        toast.info('Successfully logged out')
    }

    onMounted(fetchUsers)
</script>