<script lang="ts">
	import '../app.css';
    import { userAuth } from '$lib/components/Auth';

	let { children } = $props();
</script>


    <nav class="navbar">
        <div class="logo">Your Logo</div>

        <ul class="nav-links">
            <li><a href="/groups">Groups</a></li>
            {#if $userAuth}
                <li><a href="/users/{$userAuth}">Account</a></li>
            {:else}
                <li><a href="/users/create">Log In</a></li>
            {/if}
        </ul>
    </nav>


{@render children()}
