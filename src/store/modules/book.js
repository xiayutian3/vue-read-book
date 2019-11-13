const book = {
  state: {
    test: 1
  },
  mutations: {
    SET_TEST (state, value) {
      state.test = value
    }
  },
  actions: {
    set_test ({ commit, state }, value) {
      commit('SET_TEST', value)
    }
  }
}

export default book
