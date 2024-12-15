<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api/api';
    import { onMount } from 'svelte';
    import { GamepadIcon, MapPin, Users, Languages, Tag, Plus } from 'lucide-svelte';

    let games = $state([]);
    let tags = $state([]);

    let form = $state({
        name: '',
        description: '',
        location: '',
        isOpen: true,
        languages: '',
        maxSize: 6,
        dmNeeded: false,
        gameId: 1,
        tags: []
    });

    let selectedTags = $state([]);

    onMount(async () => {
        try {
            // Fetch games
            let gamesData = await api.getAllGames();
            games = gamesData.data.map(game => game.fields);

            // Fetch tags
            let tagsData = await api.getAllTags();
            tags = tagsData.data;
        } catch (error) {
            console.error('Failed to load initial data', error);
        }
    });

    async function createGroup(event: Event) {
        event.preventDefault();
        try {
            const newGroup = await api.createGroup({
                ...form,
                tags: selectedTags
            });
            goto(`/groups/${newGroup.id}`);
        } catch (error) {
            console.error('Group creation failed', error);
        }
    }

    function toggleTag(tag) {
        selectedTags = selectedTags.includes(tag.id)
            ? selectedTags.filter(t => t !== tag.id)
            : [...selectedTags, tag.id];
    }
</script>

<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500 mb-4">
                <Plus size={64} class="text-blue-500" />
            </div>
            
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Create a New Group</h2>

            <form onsubmit={createGroup} class="space-y-4">
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
                        bind:value={form.gameId} 
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
                        bind:value={form.maxSize} 
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
                            bind:checked={form.isOpen} 
                            class="mr-2"
                        />
                        Open Group
                    </label>
                    <label class="flex items-center">
                        <input 
                            type="checkbox" 
                            bind:checked={form.dmNeeded} 
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
                    Create Group
                </button>
            </form>
        </div>
    </div>
</div>
