<script lang="ts">
import { goto } from '$app/navigation';
import { api } from '$lib/api/api';
import { onMount } from 'svelte';
import { userAuth } from '$lib/components/Auth';
import { User, Mail, Lock, Globe, CalendarDays } from 'lucide-svelte';

let failed = $state(false);
let logname = $state("");

async function login() {
    const usersData = await api.getAllUsers();
    let users = usersData.data.map((userData) => { return {...userData.fields, id: userData.pk } });
    let user = users.find((user) => user.username == logname);
    if (user == undefined) {
        failed = true;
        return;
    }

    userAuth.set(user.id);
    goto('/users/' + user.id);
}

function signup() {
    goto('/users/create');
}
</script>

<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500 mb-4">
                <User size={64} class="text-blue-500" />
            </div>

            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h2>

            <form class="space-y-4" onsubmit={login}> 
                <div class="flex items-center">
                    <User class="mr-2 text-blue-500" size={20} />
                    <input  
                        type="text" 
                        bind:value={logname}
                        placeholder="Username"  
                        required  
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div>

                <button  
                    type="submit"  
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
                > 
                    Log in
                </button> 

                <button  
                    onclick={signup}
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
                > 
                    Sign up
                </button> 
            </form> 
        </div>
    </div>
</div>
{#if failed}
    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <p class="text-red-500 text-center">User does not exist</p>
    </div>
{/if}
