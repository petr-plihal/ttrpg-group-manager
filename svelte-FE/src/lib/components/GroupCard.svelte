<script>
    import { api } from '$lib/api/api';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let games = [];
    let form = {
        name: '',
        description: '',
        location: '',
        isOpen: true,
        languages: '',
        maxSize: 6,
        dmNeeded: false,
        gameId: null,
        tags: []
    };

    let tags = [];
    let selectedTags = [];

    onMount(async () => {
        try {
            games = await api.getGames(); // Assuming you have this method
            tags = await api.getAllTags();
        } catch (error) {
            console.error('Failed to load initial data', error);
        }
    });

    async function createGroup() {
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

<form on:submit|preventDefault={createGroup}>
    <input 
        bind:value={form.name} 
        placeholder="Group Name" 
        required 
    />

    <textarea 
        bind:value={form.description} 
        placeholder="Group Description"
    ></textarea>

    <select bind:value={form.gameId} required>
        {#each games as game}
            <option value={game.id}>{game.name}</option>
        {/each}
    </select>

    <input 
        bind:value={form.location} 
        placeholder="Location" 
    />

    <div class="tags">
        <h4>Tags</h4>
        {#each tags as tag}
            <button 
                type="button"
                class:selected={selectedTags.includes(tag.id)}
                onclick={() => toggleTag(tag)}
            >
                {tag.name}
            </button>
        {/each}
    </div>

    <div>
        <label>
            <input type="checkbox" bind:checked={form.isOpen} />
            Open Group
        </label>
        <label>
            <input type="checkbox" bind:checked={form.dmNeeded} />
            DM Needed
        </label>
    </div>

    <input 
        type="number" 
        bind:value={form.maxSize} 
        min="2" max="10" 
        placeholder="Max Group Size" 
    />

    <input 
        bind:value={form.languages} 
        placeholder="Languages" 
    />

    <button type="submit">Create Group</button>
</form>

<style>
    .tags button {
        margin: 5px;
        opacity: 0.5;
    }
    .tags button.selected {
        opacity: 1;
        background-color: #007bff;
        color: white;
    }
</style>
