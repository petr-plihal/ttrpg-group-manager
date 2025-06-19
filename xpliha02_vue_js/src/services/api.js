import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default {

    // User API calls
    async getUser(userId) {
        const response = await this.getAllUsers()
        const user = response.data.data.find(user => user.pk == userId)
        if (user) {
            return { data: user }
        } else {
            throw { response: { status: 404 } }
        }
    },

    async getUserGroupNickname(userId, groupId) {
        const response = await this.getUserGroups(userId)
        const group = response.data.data.find(group => group.pk == groupId)
        if (group) {
            return { data: group.nickname }
        } else {
            throw { response: { status: 404 } }
        }
    },

    async getGroup(groupId) {
        const response = await this.getAllGroups()
        const group = response.data.data.find(group => group.pk == groupId)
        if (group) {
            return { data: group }
        }
        else {
            throw { response: { status: 404 } }
        }
    },



    // User API calls
    createUser(userData) {
        return apiClient.post('/user/', userData)
    },
    getDMUsers() {
        return apiClient.get('/dmusers/')
    },
    getUser(userId) {
        return apiClient.get(`/user/${userId}/id/`)
    },
    getUserGroups(userId) {
        return apiClient.get(`/user/${userId}/groups/`)
    },
    getUserSchedule(userId) {
        return apiClient.get(`/user/${userId}/schedule/`)
    },
    getUserApplications(userId) {
        return apiClient.get(`/user/${userId}/applications/`)
    },
    getUserTagsLooking(userId) {
        return apiClient.get(`/user/${userId}/tags/looking/`)
    },
    getUserTagsAvoiding(userId) {
        return apiClient.get(`/user/${userId}/tags/avoiding/`)
    },
    getUserSessions(userId) {
        return apiClient.get(`/user/${userId}/sessions/`)
    },
    getOwnedGroups(userId) {
        return apiClient.get(`/user/${userId}/ownedGroups/`)
    },
    updateUser(userId, userData) {
        return apiClient.post(`/user/${userId}/update/`, userData)
    },
    getPlayerPreferences(userId) {
        return apiClient.get(`/user/${userId}/preferences/`)
    },
    addPlayerPreference(preferenceData) {
        return apiClient.post('/addPlayerPreference/', preferenceData)
    },
    removePlayerPreference(preferenceData) {
        return apiClient.post('/removePlayerPreference/', preferenceData)
    },

    // Group API calls
    createGroup(groupData) {
        return apiClient.post('/group/', groupData)
    },
    getGroupByGame(gameId) {
        return apiClient.get(`/group/${gameId}/`)
    },
    getGroupByLanguage(language) {
        return apiClient.get(`/group/${language}/`)
    },
    getGroupWithoutDM() {
        return apiClient.get('/groupnodm/')
    },
    getGroupByID(groupId) {
        return apiClient.get(`/group/${groupId}/id/`)
    },
    getGroupByName(groupName) {
        return apiClient.get(`/group/${groupName}/name/`)
    },
    getGroupByDescription(descriptionData) {
        return apiClient.post('/group/by/description/', descriptionData)
    },
    getGroupTags(groupId) {
        return apiClient.get(`/group/${groupId}/tags/`)
    },
    getGroupSessions(groupId) {
        return apiClient.get(`/getGroupSessions/${groupId}/`)
    },
    getGroupApplications(groupId) {
        return apiClient.get(`/group/${groupId}/applications/`)
    },
    getGroupPlayers(groupId) {
        return apiClient.get(`/group/${groupId}/players/`)
    },
    getGroupOwner(groupId) {
        return apiClient.get(`/group/${groupId}/owner/`)
    },
    updateGroup(groupId, groupData) {
        return apiClient.put(`/group/${groupId}/update/`, groupData)
    },
    deleteGroup(groupId) {
        return apiClient.delete(`/group/${groupId}/delete/`)
    },
    setGroupOwner(groupId, ownerData) {
        return apiClient.post(`/group/${groupId}/setOwner/`, ownerData)
    },
    setGroupUserNickname(groupId, nicknameData) {
        return apiClient.post(`/group/${groupId}/setNickname/`, nicknameData)
    },
    changeDM(groupId, userId) {
        return apiClient.post(`/group/${groupId}/dm/${userId}/`)
    },
    changeOwner(groupId, userId) {
        return apiClient.post(`/group/${groupId}/owner/${userId}/`)
    },
    addGroupTags(tagsData) {
        return apiClient.post('/addGroupTags/', tagsData)
    },
    removeGroupTags(tagsData) {
        return apiClient.post('/removeGroupTags/', tagsData)
    },
    getOpenGroups() {
        return apiClient.get('/groups/filter_open/')
    },
    getGroupsWithTags(tagsData) {
        return apiClient.post('/groups/filter_tags/', tagsData)
    },
    getGroupsWithoutTags(tagsData) {
        return apiClient.post('/groups/exclude_tags/', tagsData)
    },

    // Game API calls
    createGame(gameData) {
        return apiClient.post('/game/', gameData)
    },
    getGameByID(gameId) {
        return apiClient.get(`/game/${gameId}/id/`)
    },
    getAllGames() {
        return apiClient.get('/games/')
    },

    // Application API calls
    denyApplication(applicationId) {
        return apiClient.post(`/denyApplication/${applicationId}/`)
    },
    acceptApplication(applicationId) {
        return apiClient.post(`/acceptApplication/${applicationId}/`)
    },
    applyToGroup(applicationData) {
        return apiClient.post('/applyToGroup/', applicationData)
    },
    cancelApplication(applicationData) {
        return apiClient.post('/cancelApplication/', applicationData)
    },

    // Chat API calls
    getAppChat(appId) {
        return apiClient.get(`/application/${appId}/chat/`)
    },
    getGroupChat(groupId) {
        return apiClient.get(`/group/${groupId}/chat/`)
    },
    getChatMessages(chatId) {
        return apiClient.get(`/chat/${chatId}/`)
    },
    createChatMessage(messageData) {
        return apiClient.post('/chatmessage/create/', messageData)
    },
    editChatMessage(chatMessageId, messageData) {
        return apiClient.post(`/chatmessage/${chatMessageId}/edit/`, messageData)
    },
    deleteChatMessage(chatMessageId) {
        return apiClient.post(`/chatmessage/${chatMessageId}/delete/`)
    },

    // Schedule API calls
    createSchedule(scheduleData) {
        return apiClient.post('/schedule/create/', scheduleData)
    },
    editSchedule(schedId, scheduleData) {
        return apiClient.post(`/schedule/${schedId}/edit/`, scheduleData)
    },
    deleteSchedule(schedId) {
        return apiClient.post(`/schedule/${schedId}/delete/`)
    },

    // Tag API calls
    getAllTags() {
        return apiClient.get('/tags/')
    },
    createTag(tagData) {
        return apiClient.post('/tag/create/', tagData)
    },

    // Other API calls
    getAllUsers() {
        return apiClient.get('/users/')
    },
    getAllGroups() {
        return apiClient.get('/groups/')
    },
    getUsersByPreference(tagId) {
        return apiClient.get(`/users/${tagId}/preference/`)
    },
    getUsersByAvoidance(tagId) {
        return apiClient.get(`/users/${tagId}/avoidance/`)
    }

    

 
}