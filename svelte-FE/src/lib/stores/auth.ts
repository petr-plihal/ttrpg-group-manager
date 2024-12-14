import { writable } from 'svelte/store';

function createAuthStore() {
    const { subscribe, set, update } = writable({
        isAuthenticated: false,
        user: null,
        token: null
    });

    return {
        subscribe,
        login: (userData, token) => update(state => ({
            ...state,
            isAuthenticated: true,
            user: userData,
            token
        })),
        logout: () => set({
            isAuthenticated: false,
            user: null,
            token: null
        }),
        updateUser: (userData) => update(state => ({
            ...state,
            user: { ...state.user, ...userData }
        }))
    };
}

export const authStore = createAuthStore();
