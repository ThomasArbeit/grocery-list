import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import longpress from './directives/longpress';

const app = createApp(App);

app.use(router);
app.directive('longpress', longpress)
app.mount('#app');
