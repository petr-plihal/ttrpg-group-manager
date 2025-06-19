<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api/api';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { userAuth } from '$lib/components/Auth';
    import { GamepadIcon, MapPin, Users, User, Languages, Tag, Gamepad2 } from 'lucide-svelte';

    let groupID = $derived($page.params.groupID ? Number($page.params.groupID) : null);
    let group = $state(null);
    let members = $state(null);
    let appliedUsers = $state(null);
    let games = $state([]);
    let tags = $state([]);
    let loading = $state(true);

    let form = $state({
        name: '',
        description: '',
        location: '',
        isopen: true,
        languages: '',
        maxsize: 6,
        dmneeded: false,
        gameid: 1,
    });

    let selectedTags = $state([]);

    onMount(async () => {
        if (groupID == null) {
            error = 'No group ID provided';
            loading = false;
            return;
        }

        try {
            let groupData = await api.getGroupByID(groupID);
            if (!groupData.data.length) {
                throw new Error("Group not found");
            }
            group = groupData.data[0].fields;

            form.name = group.name;
            form.description = group.description;
            form.location = group.location;
            form.isopen = group.isopen;
            form.languages = group.languages;
            form.maxsize = group.maxsize;
            form.dmneeded = group.dmneeded;

            // Fetch games
            let gamesData = await api.getAllGames();
            games = gamesData.data.map(game => { return {...game.fields, id: game.pk}});

            // Fetch tags
            let tagsData = await api.getAllTags();
            tags = tagsData.data.map(tag => { return {...tag.fields, id: tag.pk}});

            // Fill tags
            let groupTagsData = await api.getGroupTags(groupID);
            selectedTags  = groupTagsData.data.map(tag => tag.pk);

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

            let applicationsData = await api.getGroupApplications(groupID);
            let applications = applicationsData.data.map(app => { return { ...app.fields, id: app.pk }});
            appliedUsers = await Promise.all(applications.map(async (app) => {
                let user = await api.getUserByID(app.applicantid);
                return {
                    ...user.data[0].fields,
                    applicationid: app.id
                };
            }));

        } catch (error) {
            console.error('Failed to load initial data', error);
        } finally {
            loading = false;
        }
    });

    async function update(event: Event) {
        try {
            const newGroup = await api.updateGroup(groupID, form);

            if (newGroup.status == "error") {
                throw "error";
            }

            goto(`/groups/${groupID}`);
        } catch (error) {
            console.error('Group creation failed', error);
        }
    }

    function toggleTag(tag) {
        selectedTags = selectedTags.includes(tag.id)
            ? selectedTags.filter(t => t !== tag.id)
            : [...selectedTags, tag.id];
    }

    async function kick(player) {
        await api.kickPlayer({'group_id': groupID,'user_id': player});
    }

    async function reject(player) {
        await api.denyApplication(player);
    }

    async function approve(player) {
        await api.acceptApplication(player);
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
{:else}
    <div class="left-0 absolute">
        <h3>Members:</h3>
        {#if members?.length}
            <div class="space-y-4 m-4">
                {#each members as member}
                    <div class="bg-gray-100 p-2 rounded-md flex items-center mb-2">
                        {#if member.profilePicture}
                            <img 
                                src={member.profilePicture}
                                alt={member.username}
                                class="w-5 h-5 rounded-full mr-3 object-cover"
                            />
                        {:else}
                            <User class="mr-2 text-blue-500" size={20} />
                        {/if}
                        <span class="font-medium text-gray-700">
                            {member.nickname || member.username}
                            {#if member.isowner}
                                <span class="text-xs text-blue-500 ml-2">(Owner)</span>
                            {:else}
                                <button
                                    onclick={() => kick(member.id)}
                                    class="bg-red-500 px-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Kick Player
                                </button>
                            {/if}
                        </span>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">No members</p>
        {/if}
        <h3>Applications:</h3>
        {#if appliedUsers?.length}
            <div class="space-y-4 m-4">
                {#each appliedUsers as user}
                    <div class="bg-gray-100 p-2 rounded-md flex items-center mb-2">
                        {#if user.profilePicture}
                            <img 
                                src={user.profilePicture}
                                alt={user.username}
                                class="w-5 h-5 rounded-full mr-3 object-cover"
                            />
                        {:else}
                            <User class="mr-2 text-blue-500" size={20} />
                        {/if}
                        <span class="font-medium text-gray-700">
                            {user.username}
                            <button
                                onclick={() => reject(user.applicationid)}
                                class="bg-red-500 px-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onclick={() => approve(user.applicationid)}
                                class="bg-blue-500 px-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Approve
                            </button>
                        </span>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-500">No applications</p>
        {/if}
    </div>
<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500 mb-4">
                <Gamepad2 size={64} class="text-blue-500" />
            </div>

            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Edit group information</h2>

            <form class="space-y-4" onsubmit={update}> 
                <input  
                    type="text" 
                    bind:value={form.name}  
                    placeholder="Group Name"  
                    required  
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                /> 

                <textarea  
                    bind:value={form.description}  
                    placeholder="Group Description" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                ></textarea> 

                <div class="flex items-center"> 
                    <GamepadIcon class="mr-2 text-blue-500" size={20} /> 
                    <select  
                        bind:value={form.gameid}  
                        required 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    > 
                        {#each games as game} 
                            <option value={game.id}>{game.name}</option> 
                        {/each} 
                    </select> 
                </div> 

                <div class="flex items-center"> 
                    <MapPin class="mr-2 text-blue-500" size={20} /> 
                    <input  
                        bind:value={form.location}  
                        placeholder="Location" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div> 

                <div class="flex items-center"> 
                    <Languages class="mr-2 text-blue-500" size={20} /> 
                    <input  
                        bind:value={form.languages}  
                        placeholder="Languages" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div> 

                <div class="flex items-center"> 
                    <Users class="mr-2 text-blue-500" size={20} /> 
                    <input  
                        type="number"  
                        bind:value={form.maxsize}  
                        min="2"  
                        max="10"  
                        placeholder="Max Group Size" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div> 

                <div class="flex items-center justify-between"> 
                    <label class="flex items-center"> 
                        <input  
                            type="checkbox"  
                            bind:checked={form.isopen}  
                            class="mr-2" 
                        /> 
                        Open Group 
                    </label> 
                    <label class="flex items-center"> 
                        <input  
                            type="checkbox"  
                            bind:checked={form.dmneeded}  
                            class="mr-2" 
                        /> 
                        DM Needed 
                    </label> 
                </div> 

                <div> 
                    <h4 class="flex items-center text-lg font-semibold mb-3 text-gray-700"> 
                        <Tag class="mr-2 text-blue-500" size={20} /> 
                        Group Tags 
                    </h4> 
                    <div class="flex flex-wrap gap-2"> 
                        {#each tags as tag} 
                            <button  
                                type="button" 
                                class:selected={selectedTags.includes(tag.id)} 
                                onclick={() => toggleTag(tag)} 
                                class="px-2 py-1 rounded text-sm transition-all { 
                                selectedTags.includes(tag.id)  
                                    ? 'bg-blue-500 text-white'  
                                    : 'bg-blue-100 text-blue-800' 
                                }" 
                            > 
                                {tag.name} 
                            </button> 
                        {/each} 
                    </div> 
                </div> 

                <button  
                    type="submit"  
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
                > 
                    Save changes
                </button> 
            </form> 
        </div>
    </div>
</div>
{/if}
