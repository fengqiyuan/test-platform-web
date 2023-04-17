import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store/index'
import './axios'
import 'semantic-ui-css/semantic.min.css'
import 'semantic-ui-css/semantic.min.js'


const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')