import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//更换为Token存储
const state = {
  userBean: window.localStorage.getItem('user'),
  commodity: window.localStorage.getItem('commodity'),
  token: window.localStorage.getItem('token'),
  searchText: window.localStorage.getItem('searchText'),
  commNo: window.localStorage.getItem('commNo')
}
const mutations = {
  //用户Token
  SET_TOKEN: (state, token) => {
    state.token = token
    window.localStorage.token = token
  },
  DEL_TOKEN: (state) => {
    state.token = ''
    window.localStorage.removeItem('token')
  },
  //用户信息
  GET_USER: (state, data) => {
    // 把用户信息存起来
    state.userBean = data
    window.localStorage.setItem('user', data)
  },
  LOGOUT: (state) => {
    // 登出的时候要清除用户名
    state.userBean = null
    window.localStorage.removeItem('user')
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions: {},
  modules: {},
})
