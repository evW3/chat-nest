import { post } from 'axios'
import { API_URL } from  "@/constants"

export default {
  state: { user: {} },
  getters: { user: s => s.user },
  mutations: {
    setUserToken(state, token) {
      state.user = { token };
    }
  },
  actions: {
    async signIn({ commit }, authDto) {
      try {
        const token = (await post(`${ API_URL }/auth/sign-in`, authDto)).data.token;
        localStorage.setItem('token', token);
        commit('setUserToken', token);
      } catch (e) {
        await commit('setUserToken', null);
        console.log(`[VUEX ERROR]: fetchAdmin [${ e }]`);
      }
    },

    fetchAdmin({ commit }) {
      try {
        const token = localStorage.getItem('token') || null;
        commit('setUserToken', token);
      } catch (e) {
        console.log(e);
      }
    },

    async signUp({ commit }, regDto) {
      try {
        const token = (await post(`${ API_URL }/auth/sign-up`, regDto)).data.token;
        localStorage.setItem('token', token);
        commit('setUserToken', token);
      } catch (e) {
        await commit('setUserToken', null);
        console.log(`[VUEX ERROR]: fetchAdmin [${ e }]`);
      }
    }
  }
};