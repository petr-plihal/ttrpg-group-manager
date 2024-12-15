<script>
    import { api } from '$lib/api/api';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let games = [];
    let form = {
        name: '',
        description: '',
        location: '',
        isopen: true,
        languages: '',
        maxsize: 6,
        dmneeded: false,
        gameid: 1,
        tags: []
    };

    let tags = [];
    let selectedTags = [];

    onMount(async () => {
        try {
            games = [];
            let next_game = await api.getGameByID(0);
            for (let i = 1; next_game.status == "success"; i++) {
                games.append(next_game.data[0].fields);
                next_game = await api.getGameByID(i);
            }
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

<form onsubmit={createGroup}>
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
        <option value=1>game one</option>
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
