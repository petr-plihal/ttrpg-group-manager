<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/api';
    import { GamepadIcon, Users, MapPin, Languages, Tag } from 'lucide-svelte';
    import { page } from '$app/stores';

    let groups = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let searchTerm = $state('');
    let filteredGroups = $derived(
        groups.filter(group => 
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    onMount(async () => {
        try {
            // Fetch all groups
            let groupsData = await api.getAllGroups();
            
            // Fetch game names for each group
            groups = await Promise.all(groupsData.data.map(async (groupData) => {
                let group = groupData.fields;
                let gameData = await api.getGameByID(group.gameid);
                
                // Fetch group members count
                let membersData = await api.getGroupPlayers(groupData.pk);
                
                // Fetch group tags
                let tagData = await api.getGroupTags(groupData.pk);
                
                return {
                    ...group,
                    id: groupData.pk,
                    gameName: gameData.data[0].fields.name,
                    memberCount: membersData.data.length,
                    tags: tagData.data.map((tag) => tag.fields.name)
                };
            }));
        } catch (err) {
            error = err.message || 'Failed to load groups';
            console.error('Groups load error:', err);
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each Array(6) as _}
                <div class="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
                    <div class="p-6">
                        <div class="w-full h-32 bg-gray-200 rounded-full mb-4"></div>
                        <div class="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <input 
                type="text" 
                placeholder="Search groups..." 
                bind:value={searchTerm}
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {#if error}
            <div class="text-center text-red-500">{error}</div>
        {:else if filteredGroups.length === 0}
            <div class="text-center text-gray-500">No groups found</div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredGroups as group}
                    <a href="/groups/{group.id}" class="block">
                        <div class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div class="p-6">
                                <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500 mb-4">
                                    <GamepadIcon size={64} class="text-blue-500" />
                                </div>
                                
                                <h2 class="text-xl font-bold text-gray-800 text-center mb-2">
                                    {group.name}
                                </h2>
                                
                                <div class="text-center text-gray-600 mb-4">
                                    {group.description || 'No description available'}
                                </div>

                                <div class="grid grid-cols-2 gap-2 text-sm mb-4">
                                    <div class="flex items-center justify-center">
                                        <GamepadIcon class="mr-2 text-blue-500" size={16} />
                                        <span>{group.gameName}</span>
                                    </div>
                                    <div class="flex items-center justify-center">
                                        <MapPin class="mr-2 text-blue-500" size={16} />
                                        <span>{group.location}</span>
                                    </div>
                                    <div class="flex items-center justify-center">
                                        <Users class="mr-2 text-blue-500" size={16} />
                                        <span>{group.memberCount} / {group.maxsize}</span>
                                    </div>
                                    <div class="flex items-center justify-center">
                                        <Languages class="mr-2 text-blue-500" size={16} />
                                        <span>{group.languages || 'Any'}</span>
                                    </div>
                                </div>

                                {#if group.tags?.length}
                                    <div class="flex flex-wrap justify-center gap-2">
                                        {#each group.tags.slice(0, 3) as tag}
                                            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        {/each}
                                        {#if group.tags.length > 3}
                                            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                                +{group.tags.length - 3}
                                            </span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
{/if}
