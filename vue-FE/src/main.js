import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { BButton, BOffcanvas } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(router)
app.component('BButton', BButton)
app.component('BOffcanvas', BOffcanvas)
app.mount('#app')