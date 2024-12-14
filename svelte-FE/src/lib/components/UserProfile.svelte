<script>
    import { onMount } from 'svelte';
    import { api } from '$lib/api/api.ts';
    import { authStore } from '$lib/stores/auth.ts';
    import { page } from '$app/stores';

    let userId = $derived($page.params.userID ? Number($page.params.userID) : null);
    let userData = $state(null);
    let user = $state(null);
    let groups = $state(null);
    let groupsData = $state([]);
    let schedule = $state(null);
    let scheduleData = $state([]);
    let loading = $state(true);
    let error = $state(null);

    onMount(async () => {
        if (!userId) {
            error = 'No user ID provided';
            loading = false;
            return;
        }

        try {
            userData = await api.getUserByID(userId);
            user = userData.data[0].fields;

            groupsData = await api.getUserGroups(userId);
            groups = groupsData.data.map((group) => group.fields);
            for (let i = 0; i < groups.length; i += 1) {
                let game = await api.getGameByID(groups[i].gameid);
                groups[i].gameName = game.data[0].fields.name;
            }

            scheduleData = await api.getUserSchedule(userId);
            schedule = scheduleData.data[0].fields;
        } catch (err) {
            error = err.message || 'Failed to load user profile';
            console.error('Profile load error:', err);
        } finally {
            loading = false;
        }
    });

    function editProfile() {
        // Navigate to edit profile page or open edit modal
        // Implement actual navigation logic
    }
</script>

{#if loading}
    <div class="user-profile loading">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
    </div>
{:else if user}
    <div class="user-profile">
        <img 
            src={user.profilepicture || '/default-avatar.png'} 
            alt={`${user.username}'s profile`}
        />
        <h2>{user.username}</h2>
        <p>{user.description || 'No description available'}</p>

        <section class="groups">
            <h3>Groups</h3>
            {#if groups.length}
                {#each groups as group}
                    <div>{group.name} - {group.gameName}</div>
                {/each}
            {:else}
                <p>No groups joined</p>
            {/if}
        </section>

        <section class="schedule">
            <h3>Availability</h3>
            {#if schedule.length}
                {#each schedule as slot}
                    <div>{slot.day}: {slot.starttime} - {slot.endtime}</div>
                {/each}
            {:else}
                <p>No availability set</p>
            {/if}
        </section>

        {#if $authStore.user && $authStore.user.id === userId}
            <button onclick={editProfile}>Edit Profile</button>
        {/if}
    </div>
{:else if error}
    <div class="error-message">
        <p>{error}</p>
    </div>
{/if}

<style>
    .user-profile {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
    img {
        max-width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 1rem;
    }
    .loading .skeleton-avatar {
        width: 200px;
        height: 200px;
        background-color: #e0e0e0;
        border-radius: 50%;
        margin: 0 auto;
    }
    .loading .skeleton-text {
        height: 20px;
        background-color: #e0e0e0;
        margin: 10px 0;
    }
    .error-message {
        color: red;
        text-align: center;
        padding: 20px;
    }
    .user-profile {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }
    img {
        max-width: 200px;
        border-radius: 50%;
    }
</style>
