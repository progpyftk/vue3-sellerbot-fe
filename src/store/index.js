// store/index.js
import { createStore } from 'vuex';
import actioncable from 'actioncable';


const store = createStore({
  state() {
    return {
      currentUser: "not logged",
      authToken: null,
      cable: null,
    };
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
    },
    SET_CABLE(state, cable) {
      console.log('Setting cable instance:', cable);
      state.cable = cable;
    },
    SET_PROCESSING_PROMOTIONS(state, isProcessing) {
      console.log(`isProcessingPromotions is set to: ${isProcessing}`);
      state.isProcessingPromotions = isProcessing;
    },
  },
  actions: {
    createCable({ commit }) {
      const cable = actioncable.createConsumer( import.meta.env.VITE_CABLE_URL );
      commit('SET_CABLE', cable);
    },
    setProcessingPromotions({ commit }, isProcessing) {
      commit('SET_PROCESSING_PROMOTIONS', isProcessing);
    },
  },
  getters: {
    // Definições de getters
  },
});

export default store;
