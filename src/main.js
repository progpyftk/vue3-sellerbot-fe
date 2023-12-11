/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import ActionCableVue from 'actioncable-vue';

import store from './store';

const app = createApp(App)

registerPlugins(app)
app.use(store);
app.use(ActionCableVue, {
    debug: true,
    debugLevel: 'error',
    connectionUrl: import.meta.env.VITE_CABLE_URL, // Replace with your WebSocket server URL
    connectImmediately: true,
  });
app.mount('#app')
