import { createApp } from 'vue' // Vue 3
import App from './App.vue' // Main App component
import router from './router' // Routing

import { createPinia } from 'pinia' // Pinia - for state management - selected user

// Bootstrap - for styling and components
import { BButton, BOffcanvas } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// Toastification - for notifications
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// ---------------------------------------------------
// Create the app
const app = createApp(App)
app.use(router)

// Pinia - for state management - selected user
const pinia = createPinia()
app.use(pinia)

// Bootstrap - for styling and components
app.component('BButton', BButton)
app.component('BOffcanvas', BOffcanvas)

// Toastification - for notifications
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
})

// ---------------------------------------------------
// Mount the app
app.mount('#app')
