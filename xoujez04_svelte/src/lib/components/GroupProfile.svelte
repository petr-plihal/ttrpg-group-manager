<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/api';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { userAuth } from '$lib/components/Auth';
    import { User, Users, GamepadIcon, MapPin, Languages, Tag } from 'lucide-svelte';

    let groupID = $derived($page.params.groupID ? Number($page.params.groupID) : null);
    let group = $state(null);
    let members = $state(null);
    let tagData = $state(null);
    let tags = $state(null);
    let sessions = $state(null);
    let loading = $state(true);
    let error = $state(null);
    let isMember = $state(false);
    let isOwner = $state(false);
    let applied = $state(false);

    onMount(async () => {
        if (groupID == null) {
            error = 'No group ID provided';
            loading = false;
            return;
        }

        try {
            // Fetch group details
            let groupData = await api.getGroupByID(groupID);
            if (!groupData.data.length) {
                throw new Error("Group not found");
            }
            group = groupData.data[0].fields;

            // Fetch game details for this group
            let gameData = await api.getGameByID(group.gameid);
            group.gameName = gameData.data[0].fields.name;

            // Fetch group members
            let membersData = await api.getGroupPlayers(groupID);
            members = await Promise.all(membersData.data.map(async (memberData) => {
                let member = await api.getUserByID(memberData.fields.userid);
                return {
                    ...member.data[0].fields,
                    id: member.data[0].pk,
                    nickname: memberData.fields.nickname,
                    isowner: memberData.fields.isowner,
                };
            }));

            if (members.map(member => member.id).includes($userAuth)) {
                let groupMember = members.filter(member => member.id == $userAuth);
                if (groupMember[0].isowner) {
                    isOwner = true;
                }
                isMember = true;
            }

            let applicationsData = await api.getUserApplications($userAuth);
            let appliedUsers = applicationsData.data.map(app => app.fields.groupid);

            if (appliedUsers.includes(groupID)) {
                applied = true;
            }

            // Fetch group tags
            let tagData = await api.getGroupTags(groupID);
            tags = tagData.data.map((tag) => tag.fields.name);

            // Fetch upcoming sessions
            let sessionsData = await api.getGroupSessions(groupID);
            sessions = sessionsData.data.map((session) => session.fields);
        } catch (err) {
            error = err.message || 'Failed to load group profile';
            console.error('Group load error:', err);
        } finally {
            loading = false;
        }
    });

    async function join() {
        await api.applyToGroup({group_id: groupID, user_id: $userAuth});
        applied = true;
    }

    async function edit() {
        goto(`/groups/${groupID}/edit`);
    }
</script>

{#if loading}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 animate-pulse">
        <div class="flex flex-col items-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
            <div class="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
    </div>
{:else if group}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6 text-center">
            <div class="mb-6">
                <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500">
                    <GamepadIcon size={64} class="text-blue-500" />
                </div>
                <h2 class="mt-4 text-2xl font-bold text-gray-800">{group.name}</h2>
                <p class="text-gray-600 mt-2">
                    {group.description || 'No description available'}
                </p>
            </div>

            <div class="mb-6 grid grid-cols-2 gap-4 text-left">
                <div class="flex items-center">
                    <GamepadIcon class="mr-2 text-blue-500" size={20} />
                    <span class="font-semibold">{group.gameName}</span>
                </div>
                <div class="flex items-center">
                    <MapPin class="mr-2 text-blue-500" size={20} />
                    <span>{group.location}</span>
                </div>
                <div class="flex items-center">
                    <Users class="mr-2 text-blue-500" size={20} />
                    <span>{members?.length || 0} / {group.maxsize} Members</span>
                </div>
                <div class="flex items-center">
                    <Languages class="mr-2 text-blue-500" size={20} />
                    <span>{group.languages || 'Any Language'}</span>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="flex items-center justify-center text-lg font-semibold mb-3 text-gray-700">
                    <Tag class="mr-2 text-blue-500" size={20} />
                    Group Tags
                </h3>
                {#if tags?.length}
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each tags as tag}
                            <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                {tag}
                            </span>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500">No tags added</p>
                {/if}
            </div>

            <div>
                <h3 class="flex items-center justify-center text-lg font-semibold mb-3 text-gray-700">
                    <Users class="mr-2 text-blue-500" size={20} />
                    Group Members
                </h3>
                {#if members?.length}
                    <div class="space-y-2">
                        {#each members as member}
                            <a href="/users/{member.id}">
                                <div class="bg-gray-100 p-2 rounded-md flex items-center mb-2">
                                    {#if member.profilePicture}
                                        <img 
                                            src={member.profilePicture}
                                            alt={member.username}
                                            class="w-8 h-8 rounded-full mr-3 object-cover"
                                        />
                                    {:else}
                                        <User class="mr-2 text-blue-500" size={20} />
                                    {/if}
                                    <span class="font-medium text-gray-700">
                                        {member.nickname || member.username}
                                        {#if member.isowner}
                                            <span class="text-xs text-blue-500 ml-2">(Owner)</span>
                                        {/if}
                                    </span>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500">No members</p>
                {/if}
            </div>

            <!-- Upcoming Sessions Section -->
            {#if sessions?.length}
                <div class="mt-6">
                    <h3 class="flex items-center justify-center text-lg font-semibold mb-3 text-gray-700">
                        Upcoming Sessions
                    </h3>
                    <div class="space-y-2">
                        {#each sessions as session}
                            <div class="bg-gray-100 p-2 rounded-md">
                                <div class="flex justify-between">
                                    <span class="font-medium text-gray-700">
                                        Session {session.num || 'N/A'}
                                    </span>
                                    <span class="text-gray-500 text-sm">
                                        {new Date(session.starttime).toLocaleString()}
                                    </span>
                                </div>
                                {#if session.description}
                                    <p class="text-xs text-gray-600 mt-1">
                                        {session.description}
                                    </p>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <div class="w-full max-w-md mx-auto mt-5 bg-white shadow-lg rounded-lg overflow-hidden">
        {#if isMember}
            {#if isOwner}
                <button  
                    onclick={edit}
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
                > 
                    Edit Group
                </button> 
            {/if}
        {:else if applied}
            <p class="text-blue-500 text-center py-4">You applied to this group, now wait for confirmation</p>
        {:else}
            <button  
                onclick={join}
                class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
            > 
                Join Group
            </button> 
        {/if}
    </div>
{:else if error}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <p class="text-red-500 text-center">{error}</p>
    </div>
{/if}
