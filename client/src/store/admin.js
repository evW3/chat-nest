import { post } from 'axios'
import { API_URL } from  "@/constants"

export default {
  state: { admin: {} },
  getters: { admin: s => s.admin },
  mutations: {
    setAdmin(state, token) {
      state.admin = { token };
    }
  },
  actions: {
    async signIn({ commit }, authDto) {
      try {
        console.log(authDto);
        const token = (await post(`${ API_URL }/auth/sign-in`, authDto)).data.token;
        localStorage.setItem('token', token);
        console.log(token);
        await commit('setAdmin', token);
      } catch (e) {
        await commit('setAdmin', null);
        console.log(`[VUEX ERROR]: fetchAdmin [${ e }]`);
      }
    }
  }
};