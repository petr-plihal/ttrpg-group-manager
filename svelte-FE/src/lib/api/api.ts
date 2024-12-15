const BASE_URL = 'http://127.0.0.1:8000';

async function request(
	endpoint: string,
	method = 'GET',
	body: [string | number, string | number] | null = null
) {
	const headers = {
		'Content-Type': 'application/json'
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
	createUser: (userData: [string|number, string|number]) => request('/user', 'POST', userData),
	getDMUsers: () => request('/dmusers'),
	createGroup: (groupData: [string|number, string|number]) => request('/group', 'POST', groupData),
	getGroupByGame: (gameID: number) => request(`/group/${gameID}`),
	getGroupByLanguage: (languages: string) => request(`/group/${languages}`),
	getGroupWithoutDM: () => request('/groupnodm'),
	createGame: (gameData: [string|number, string|number]) => request('/game', 'POST', gameData),
	getGameByID: (gameID: number) => request(`/game/${gameID}/id`),
	denyApplication: (applicationID: number) => request(`/denyApplication/${applicationID}`, 'POST'),
	acceptApplication: (applicationID: number) => request(`/acceptApplication/${applicationID}`, 'POST'),
	kickPlayer: (data: [string|number, string|number]) => request('/kickPlayer', 'POST', data),
	invitePlayer: (data: [string|number, string|number]) => request('/invitePlayer', 'POST', data),
	applyToGroup: (data: [string|number, string|number]) => request('/applyToGroup', 'POST', data),
	cancelApplication: (data: [string|number, string|number]) => request('/cancelApplication', 'POST', data),
	getGroupSessions: (groupID: number) => request(`/getGroupSessions/${groupID}`),
	addGroupTags: (data: [string|number, string|number]) => request('/addGroupTags', 'POST', data),
	removeGroupTags: (data: [string|number, string|number]) => request('/removeGroupTags', 'POST', data),
	addPlayerPreference: (data: [string|number, string|number]) => request('/addPlayerPreference', 'POST', data),
	removePlayerPreference: (data: [string|number, string|number]) => request('/removePlayerPreference', 'POST', data),
	getAllUsers: () => request('/users'),
	getAllGroups: () => request('/groups'),
	getAllGames: () => request('/games'),
	getOpenGroups: () => request('/groups/filter_open'),
	getGroupsWithTags: () => request('/groups/filter_tags'),
	getGroupsWithoutTags: () => request('/groups/exclude_tags'),
	getUserSchedule: (userID: number) => request(`/user/${userID}/schedule`),
	getAppChat: (appID: number) => request(`/application/${appID}/chat`),
	getUserByID: (userID: number) => request(`/user/${userID}/id`),
	updateUser: (userID: number, data: [number | string, number | string]) => request(`/user/${userID}/update`, 'PUT', data),
	updateGroup: (groupID: number, data: [string | number, string | number]) => request(`/group/${groupID}/update`, 'PUT', data),
	getUserGroups: (userID: number) => request(`/user/${userID}/groups`),
	getGroupOwner: (groupID: number) => request(`/group/${groupID}/owner`),
	getPlayerPreferences: (userID: number) => request(`/user/${userID}/preferences`),
	getGroupTags: (groupID: number) => request(`/group/${groupID}/tags`),
	getUserSessions: (userID: number) => request(`/user/${userID}/sessions`),
	getOwnedGroups: (userID: number) => request(`/user/${userID}/ownedGroups`),
	deleteGroup: (groupID: number) => request(`/group/${groupID}/delete`),
	setGroupOwner: (groupID: number, data: [string, number]) => request(`/group/${groupID}/setOwner`, 'POST', data),
	setGroupUserNickname: (groupID: number) => request(`/group/${groupID}/setNickname`),
	getUserApplications: (userID: number) => request(`/user/${userID}/applications`),
	getGroupApplications: (groupID: number) => request(`/group/${groupID}/applications`),
	getAllTags: () => request('/tags'),
	createTag: (data: [string|number, string|number]) => request('/tag/create', 'POST', data),
	getGroupChat: (groupID: number) => request(`/group/${groupID}/chat`),
	getGroupApps: (groupID: number) => request(`/group/${groupID}/applications`),
	getGroupPlayers: (groupID: number) => request(`/group/${groupID}/players`),
	getGroupByID: (groupID: number) => request(`/group/${groupID}/id`),
	getGroupByName: (groupName: string) => request(`/group/${groupName}/name`),
	getGroupByDescription: (data: [string|number, string|number]) => request('/group/by/description', 'POST', data),
	getUsersByPreference: (tagID: number) => request(`/users/${tagID}/preference`),
	getUsersByAvoidance: (tagID: number) => request(`/users/${tagID}/avoidance`),
	getChatMessages: (chatID: number) => request(`/chat/${chatID}`),
	createChatMessage: (data: [string|number, string|number]) => request('/chatmessage/create', 'POST', data),
	editChatMessage: (chatMessageID: number, data: [string|number, string|number]) => request(`/chatmessage/${chatMessageID}/edit`, 'POST', data),
	deleteChatMessage: (chatMessageID: number) => request(`/chatmessage/${chatMessageID}/delete`),
    createSchedule: (data: [string|number, string|number]) => request("/schedule/create", 'POST', data),
    editSchedule: (schedID: number, data: [string|number, string|number]) =>  request(`/schedule/${schedID}/edit`, 'POST', data),
    deleteSchedule: (schedID: number) => request(`/schedule/${schedID}/delete`),
    changeDM: (groupID: number, userID: number) => request(`/group/${groupID}/dm/${userID}`),
    changeOwner: (groupID: number, userID: number) => request(`/group/${groupID}/owner/${userID}`),
};
