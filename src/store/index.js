import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters'

Vue.use(Vuex)
// const state = {
//   test: 1
// }
// const mutations = {
//   SET_TEST (state, value) {
//     state.test = value
//   }
// }
// const actions = {
//   set_test ({ commit, state }, value) {
//     commit('SET_TEST', value)
//   }
// }

export default new Vuex.Store({
  // state,
  // mutations,
  // actions,
  modules: {
    book
  },
  getters
})
