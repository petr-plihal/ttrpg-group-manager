import { get } from "svelte/store";
import { authStore } from "$lib/stores/auth";

const BASE_URL = "localhost:8000";

async function request(endpoint, method = "GET", body = null) {
  const token = get(authStore).token;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

export const api = {
  createUser: (userData) => request("/user", "POST", userData),
  getDMUsers: () => request("/dmusers"),
  createGroup: (groupData) => request("/group", "POST", groupData),
  getGroupByGame: (gameID) => request(`/group/${gameID}`),
  getGroupByLanguage: (languages) => request(`/group/${languages}`),
  getGroupWithoutDM: () => request("/groupnodm"),
  createGame: (gameData) => request("/game", "POST", gameData),
  denyApplication: (applicationID) => request(`/denyApplication/${applicationID}`),
  acceptApplication: (applicationID) => request(`/acceptApplication/${applicationID}`),
  kickPlayer: (data) => request("/kickPlayer", "POST", data),
  invitePlayer: (data) => request("/invitePlayer", "POST", data),
  applyToGroup: (data) => request("/applyToGroup", "POST", data),
  cancelApplication: (data) => request("/cancelApplication", "POST", data),
  getGroupSessions: (groupID) => request(`/getGroupSessions/${groupID}`),
  addGroupTags: (data) => request("/addGroupTags", "POST", data),
  removeGroupTags: (data) => request("/removeGroupTags", "POST", data),
  addPlayerPreference: (data) => request("/addPlayerPreference", "POST", data),
  removePlayerPreference: (data) => request("/removePlayerPreference", "POST", data),
  getAllUsers: () => request("/users"),
  getAllGroups: () => request("/groups"),
  getOpenGroups: () => request("/groups/filter_open"),
  getGroupsWithTags: () => request("/groups/filter_tags"),
  getGroupsWithoutTags: () => request("/groups/exclude_tags"),
  getUserSchedule: (userID) => request(`/user/${userID}/schedule`),
  getAppChat: (appID) => request(`/application/${appID}/chat`),
  getUserByID: (userID) => request(`/user/${userID}/id`),
  updateUser: (userID) => request(`/user/${userID}/update`),
  updateGroup: (groupID) => request(`/group/${groupID}/update`),
  getUserGroups: (userID) => request(`/user/${userID}/groups`),
  getGroupOwner: (groupID) => request(`/group/${groupID}/owner`),
  getPlayerPreferences: (userID) => request(`/user/${userID}/preferences`),
  getGroupTags: (groupID) => request(`/group/${groupID}/tags`),
  getUserSessions: (userID) => request(`/user/${userID}/sessions`),
  getOwnedGroups: (userID) => request(`/user/${userID}/ownedGroups`),
  deleteGroup: (groupID) => request(`/group/${groupID}/delete`),
  setGroupOwner: (groupID) => request(`/group/${groupID}/setOwner`),
  setGroupUserNickname: (groupID) => request(`/group/${groupID}/setNickname`),
  getUserApplications: (userID) => request(`/user/${userID}/applications`),
  getGroupApplications: (groupID) => request(`/group/${groupID}/applications`),
  getAllTags: () => request("/tags"),
  createTag: (data) => request("/tag/create", 'POST', data),
  getGroupChat: (groupID) => request(`/group/${groupID}/chat`),
  getGroupApps: (groupID) => request(`/group/${groupID}/applications`),
  getGroupPlayers: (groupID) => request(`/group/${groupID}/players`),
  getGroupByID: (groupID) => request(`/group/${groupID}/id`),
  getGroupByName: (groupName) => request(`/group/${groupName}/name`),
  getGroupByDescription: (data) => request("/group/by/description", 'POST', data),
  getUsersByPreference: (tagID) => request(`/users/${tagID}/preference`),
  getUsersByAvoidance: (tagID) => request(`/users/${tagID}/avoidance`),
  getChatMessages: (chatID) => request(`/chat/${chatID}`),
  createChatMessage: (data) => request("/chatmessage/create", 'POST', data),
  editChatMessage: (chatMessageID, data) => request(`/chatmessage/${chatMessageID}/edit`, 'POST', data),
  deleteChatMessage: (chatMessageID) => request(`/chatmessage/${chatMessageID}/delete`),
};
