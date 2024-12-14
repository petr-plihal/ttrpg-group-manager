// src/lib/api/api.js
import { get } from 'svelte/store';
import { authStore } from '$lib/stores/auth';

const BASE_URL = 'localhost:8000';

async function request(endpoint, method = 'GET', body = null) {
	const token = get(authStore).token;

	const headers = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	};

	const config = {
		method,
		headers,
		...(body && { body: JSON.stringify(body) })
	};

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, config);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'An error occurred');
		}

		return await response.json();
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
}

export const api = {
	createUser: (userData) => request('/user', 'POST', userData),
	getDMUsers: () => request('/dmusers'),
	createGroup: (groupData) => request('/group', 'POST', groupData),
	getGroupByGame: (gameID) => request(`/group/${gameID}`),
	getGroupByLanguage: (languages) => request(`/group/${languages}`),
	getGroupWithoutDM: () => request('/groupnodm'),
	createGame: (gameData) => request('/game', 'POST', gameData),
	denyApplication: (applicationID) => request(`/denyApplication/${applicationID}`),
	acceptApplication: (applicationID) => request(`/acceptApplication/${applicationID}`),
	kickPlayer: (data) => request('/kickPlayer', 'POST', data),
	invitePlayer: (data) => request('/invitePlayer', 'POST', data),
	applyToGroup: (data) => request('/applyToGroup', 'POST', data),
	cancelApplication: (data) => request('/cancelApplication', 'POST', data),
	getGroupSessions: (groupID) => request(`/getGroupSessions/${groupID}`),
	addGroupTags: (data) => request('/addGroupTags', 'POST', data),
	removeGroupTags: (data) => request('/removeGroupTags', 'POST', data),
	addPlayerPreference: (data) => request('/addPlayerPreference', 'POST', data),
	removePlayerPreference: (data) => request('/removePlayerPreference', 'POST', data),
	getAllUsers: () => request('/users'),
	getAllGroups: () => request('/groups'),
	getOpenGroups: () => request('/groups/filter_open'),
	getGroupsWithTags: () => request('/groups/filter_tags'),
	getGroupsWithoutTags: () => request('/groups/exclude_tags'),
	getUserSchedule: (userID) => request(`/user/${userID}/schedule`),
	// getAppChat: () => request('/application/(?P<app_id>\\d+)/chat'),
	getUserByID: (userID) => request(`/user/${userID}/id`),
	updateUser: (userID) => request(`/user/${userID}/update`),
	updateGroup: () => request('/group/(?P<group_id>\\d+)/update'),
	getUserGroups: () => request('/user/(?P<user_id>\\d+)/groups'),
	getGroupOwner: () => request('/group/(?P<group_id>\\d+)/owner'),
	getPlayerPreferences: () => request('/user/(?P<user_id>\\d+)/preferences'),
	getGroupTags: () => request('/group/(?P<group_id>\\d+)/tags'),
	getUserSessions: () => request('/user/(?P<user_id>\\d+)/sessions'),
	getOwnedGroups: () => request('/user/(?P<user_id>\\d+)/ownedGroups'),
	deleteGroup: () => request('/group/(?P<group_id>\\d+)/delete'),
	setGroupOwner: () => request('/group/(?P<group_id>\\d+)/setOwner'),
	setGroupUserNickname: () => request('/group/(?P<group_id>\\d+)/setNickname'),
	getUserApplications: () => request('/user/(?P<user_id>\\d+)/applications'),
	getGroupApplications: () => request('/group/(?P<group_id>\\d+)/applications'),
	getAllTags: () => request('/tags'),
	createTag: () => request('/tag/create'),
	getGroupChat: () => request('/group/(?P<group_id>\\d+)/chat'),
	getGroupApps: () => request('/group/(?P<group_id>\\d+)/applications'),
	getGroupPlayers: () => request('/group/(?P<group_id>\\d+)/players'),
	getGroupByID: () => request('/group/(?P<group_id>\\d+)/id'),
	getGroupByName: () => request('/group/(?P<group_name>\\w+)/name'),
	getGroupByDescription: () => request('/group/by/description'),
	getUsersByPreference: () => request('/users/(?P<tag_id>\\d+)/preference'),
	getUsersByAvoidance: () => request('/users/(?P<tag_id>\\d+)/avoidance'),
	getChatMessages: () => request('/chat/(?P<chat_id>\\d+)'),
	createChatMessage: () => request('/chatmessage/create'),
	editChatMessage: () => request('/chatmessage/(?P<chatmessage_id>\\d+)/edit'),
	deleteChatMessage: () => request('/chatmessage/(?P<chatmessage_id>\\d+)/delete')
};
