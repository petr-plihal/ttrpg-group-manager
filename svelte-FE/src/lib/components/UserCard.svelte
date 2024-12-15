<script lang="ts">
    import { goto } from '$app/navigation';
    import { api } from '$lib/api/api';
    import { onMount } from 'svelte';
    import { User, Mail, Lock, Globe, CalendarDays } from 'lucide-svelte';

    let loading = $state(true);
    let languages = $state([]);
    let failed = $state(false);

    let form = $state({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        description: '',
        languages: '',
        timezone: '',
        availability: [],
        candm: false,
        profilepicture: "",
    });

    let availabilitySlots = $state([
        { day: 'Monday', starttime: '', endtime: '' },
        { day: 'Tuesday', starttime: '', endtime: '' },
        { day: 'Wednesday', starttime: '', endtime: '' },
        { day: 'Thursday', starttime: '', endtime: '' },
        { day: 'Friday', starttime: '', endtime: '' },
        { day: 'Saturday', starttime: '', endtime: '' },
        { day: 'Sunday', starttime: '', endtime: '' }
    ]);

    onMount(async () => {
        try {
            // Fetch available languages
            let languagesData = await api.getAllLanguages();
            languages = languagesData.data.map(lang => lang.name);
        } catch (error) {
            console.error('Failed to load languages', error);
        } finally {
            loading = false;
        }
    });

    function updateAvailability(index, field, value) {
        availabilitySlots[index][field] = value;
    }

    async function createUser(event: Event) {
        event.preventDefault();
        
        // Validate password match
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Filter out availability slots with no times
        const filteredAvailability = availabilitySlots.filter(
            slot => slot.starttime && slot.endtime
        );

        try {
            const newUser = await api.createUser({
                ...form,
                availability: filteredAvailability,
            });

            if (newUser.status === "error") {
                throw new Error("User creation failed");
            }

            goto(`/users/${newUser.userid}`);
        } catch (error) {
            console.error('User creation failed', error);
            failed = true;
        }
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
<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
            <div class="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-4 border-blue-500 mb-4">
                <User size={64} class="text-blue-500" />
            </div>

            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Create a New User</h2>

            <form class="space-y-4" onsubmit={createUser}> 
                <div class="flex items-center">
                    <User class="mr-2 text-blue-500" size={20} />
                    <input  
                        type="text" 
                        bind:value={form.username}  
                        placeholder="Username"  
                        required  
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div>

                <textarea  
                    bind:value={form.description}  
                    placeholder="User Description" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                ></textarea> 

                <div class="flex items-center">
                    <Globe class="mr-2 text-blue-500" size={20} />
                    <input  
                        type="text" 
                        bind:value={form.languages}  
                        placeholder="Languages" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div>

                <div class="flex items-center">
                    <CalendarDays class="mr-2 text-blue-500" size={20} />
                    <input  
                        type="text" 
                        bind:value={form.timezone}  
                        placeholder="Timezone" 
                        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    /> 
                </div>

                <div class="flex items-center">
                        <input type="checkbox" id="candm" name="candm" />
                        <label for="candm" class="mx-3">Can be a DM</label>
                </div>

                <div>
                    <h4 class="text-lg font-semibold mb-3 text-gray-700">
                        Availability
                    </h4>
                    {#each availabilitySlots as slot, index}
                        <div class="mb-2 flex items-center space-x-2">
                            <span class="w-24 text-gray-700">{slot.day}</span>
                            <input 
                                type="time" 
                                placeholder="Start Time"
                                value={slot.starttime}
                                oninput={(e) => updateAvailability(index, 'starttime', e.target.value)}
                                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                                type="time" 
                                placeholder="End Time"
                                value={slot.endtime}
                                oninput={(e) => updateAvailability(index, 'endtime', e.target.value)}
                                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    {/each}
                </div>

                <button  
                    type="submit"  
                    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors" 
                > 
                    Create User 
                </button> 
            </form> 
                {#if failed}
                    <div class="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
                        <p class="text-red-500 text-center">User creation failed</p>
                    </div>
                {/if}
        </div>
    </div>
</div>
{/if}
