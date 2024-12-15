<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/api';
    import { page } from '$app/stores';
    import { userAuth } from '$lib/components/Auth';
    import { User, Calendar, Users } from 'lucide-svelte';

    let userID = $derived($page.params.userID ? Number($page.params.userID) : null);
    let user = $state(null);
    let groups = $state(null);
    let schedule = $state(null);
    let loading = $state(true);
    let error = $state(null);

    onMount(async () => {
        if (userID == null) {
            error = 'No user ID provided';
            loading = false;
            return;
        }

        try {
            let userData = await api.getUserByID(userID);
            if (!userData.data.length) {
                throw new Error("User not found");
            }
            user = userData.data[0].fields;

            let groupsData = await api.getUserGroups(userID);
            groups = await Promise.all(groupsData.data.map(async (group) => {
                let game = await api.getGameByID(group.fields.gameid);
                return {
                    ...group.fields,
                    id: group.pk,
                    gameName: game.data[0].fields.name
                };
            }));

            let scheduleData = await api.getUserSchedule(userID);
            schedule = scheduleData.data.map((data) => data.fields);
        } catch (err) {
            error = err.message || 'Failed to load user profile';
            console.error('Profile load error:', err);
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 animate-pulse">
        <div class="flex flex-col items-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
            <div class="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
    </div>
{:else if user}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6 text-center">
            <div class="mb-6">
                {#if user.profilepicture && false}
                <img 
                    src={user.profilepicture} 
                    alt={`${user.username}'s profile`}
                    class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-500"
                />
                {:else}
                <User class="text-blue-500 object-cover rounded-full mx-auto border-4 border-blue-500" size={90} />
                {/if}
                <h2 class="mt-4 text-2xl font-bold text-gray-800">{user.username}</h2>
                <p class="text-gray-600 mt-2">
                    {user.description || 'No description available'}
                </p>
            </div>

            <div class="mb-6">
                <h3 class="flex items-center justify-center text-lg font-semibold mb-3 text-gray-700">
                    <Users class="mr-2 text-blue-500" size={20} />
                    Groups
                </h3>
                {#if groups?.length}
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each groups as group}
                            <a href="/groups/{group.id}">
                                <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {group.name} - {group.gameName}
                                </span>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500">No groups joined</p>
                {/if}
            </div>

            <div>
                <h3 class="flex items-center justify-center text-lg font-semibold mb-3 text-gray-700">
                    <Calendar class="mr-2 text-blue-500" size={20} />
                    Availability
                </h3>
                {#if schedule?.length}
                    <div class="space-y-2">
                        {#each schedule as slot}
                            <div class="bg-gray-100 p-2 rounded-md flex justify-between">
                                <span class="font-medium text-gray-700">{slot.day}</span>
                                <span class="text-gray-500">
                                    {slot.starttime} - {slot.endtime}
                                </span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500">No availability set</p>
                {/if}
            </div>
        </div>
    </div>
{:else if error}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <p class="text-red-500 text-center">{error}</p>
    </div>
{/if}
