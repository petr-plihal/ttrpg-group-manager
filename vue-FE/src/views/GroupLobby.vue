<template>
    <Base>
        <template #navbar-buttons>
            <!-- Můžete přidat tlačítka specifická pro tuto stránku -->
        </template>
        <template #default>
            <div class="group-lobby" v-if="group && isMember">
                <div class="header">
                    <div class="game-system">{{ group.fields.gameid }}</div>
                    <div class="group-name">{{ group.fields.name }}</div>
                    <div class="next-session">{{ nextSessionDate }}</div>
                    <div v-if="isOwner">
                        <button @click="editGroup">Upravit skupinu</button>
                    </div>
                </div>
                <div class="main-content">
                    <div class="left-panel">
                        <div class="members">
                            <h3>Členové</h3>
                            <ul>
                                <li v-for="player in players" :key="player.pk">
                                    <a :href="'/user/' + player.fields.userid + '/profile'">
                                        {{ player.fields.nickname || 'Uživatel ' + player.fields.userid }} 
                                        <span v-if="player.fields.isowner">(DM)</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="right-panel">
                        <div class="tabs">
                            <button @click="activeTab = 'chat'">Chat</button>
                            <button @click="activeTab = 'calendar'">Kalendář</button>
                            <button @click="activeTab = 'description'">Popis</button>
                        </div>
                        <div class="tab-content">
                            <div v-if="activeTab === 'chat'">
                                <!-- Chat obsah -->
                            </div>
                            <div v-if="activeTab === 'calendar'">
                                <!-- Kalendář obsah -->
                            </div>
                            <div v-if="activeTab === 'description'">
                                <p>{{ group.fields.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="!isMember">
                <p>Nemáte oprávnění zobrazit tuto skupinu.</p>
            </div>
            <div v-else>
                <p>Načítání...</p>
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

const group = ref(null)
const players = ref([])
const nextSessionDate = ref('')
const activeTab = ref('description')
const isMember = ref(false)
const isOwner = ref(false)

const userStore = useUserStore()
const currentUser = userStore.currentUser

async function fetchGroupData() {
    try {
        const groupResponse = await api.getAllGroups()
        group.value = groupResponse.data.data.find(g => g.pk == groupId)

        const playersResponse = await api.getGroupPlayers(groupId)
        players.value = playersResponse.data.data

        // Check if the current user is a member of the group
        isMember.value = players.value.some(player => player.fields.userid === currentUser.pk)

        if (!isMember.value) {
            console.warn('User is not a member of the group')
            return
        }

        // Check if the current user is the owner of the group
        isOwner.value = players.value.some(player => player.fields.userid === currentUser.pk && player.fields.isowner)

        const sessionsResponse = await api.getGroupSessions(groupId)
        if (sessionsResponse.data.data.length > 0) {
            nextSessionDate.value = new Date(sessionsResponse.data.data[0].fields.starttime).toLocaleString()
        }
    } catch (error) {
        console.error('Error fetching group data:', error)
    }
}

function editGroup() {
    router.push(`/group/${groupId}/edit`)
}

onMounted(fetchGroupData)
</script>

<style scoped>
.group-lobby {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f5f5f5;
}

.main-content {
    display: flex;
    flex: 1;
}

.left-panel {
    width: 25%;
    padding: 1rem;
    background-color: #e9e9e9;
}

.right-panel {
    flex: 1;
    padding: 1rem;
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
}

.tab-content {
    flex: 1;
}
</style>