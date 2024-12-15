import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
    }),
    actions: {
        setUser(user) {
            this.currentUser = user
            localStorage.setItem('currentUser', JSON.stringify(user))
        },
        clearUser() {
            this.currentUser = null
            localStorage.removeItem('currentUser')
        }
    }
})