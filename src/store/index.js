// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      currentUser: "not logged",
      authToken: null,
      //backend_url: 'http://api.sellerbot.com.br',
        backend_url: 'http://localhost:3000'
    };
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
    },
  },
  actions: {
    // Definições de ações
  },
  getters: {
    // Definições de getters
  },
});

export default store;
