<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="user-groups-owned">
                <h2>Moje skupiny</h2>
                <ul v-if="groups.length">
                    <li v-for="group in groups" :key="group.pk">
                        <router-link :to="`/group/${group.pk}/lobby`">{{ group.fields.name }}</router-link>
                    </li>
                </ul>
                <p v-else>Nemáte žádné skupiny, které vlastníte.</p>
            </div>
        </template>
    </Base>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Base from '../components/Base.vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const currentUser = userStore.currentUser

const groups = ref([])

async function fetchUserGroups() {
    try {
        const userGroupsResponse = await api.getUserGroups(currentUser.pk)
        const userGroups = userGroupsResponse.data.data

        const ownedGroups = []
        for (const group of userGroups) {
            const groupOwnerResponse = await api.getGroupOwner(group.pk)
            const isOwner = groupOwnerResponse.data.data.some(owner => owner.fields.userid === currentUser.pk && owner.fields.isowner)
            if (isOwner) {
                ownedGroups.push(group)
            }
        }

        groups.value = ownedGroups
    } catch (error) {
        console.error('Error fetching user groups:', error)
    }
}

onMounted(fetchUserGroups)
</script>

<style scoped>
.user-groups-owned {
    padding: 1rem;
}

.user-groups-owned h2 {
    margin-top: 1rem;
}

.user-groups-owned ul {
    list-style-type: none;
    padding: 0;
}

.user-groups-owned li {
    margin-bottom: 0.5rem;
}
</style>