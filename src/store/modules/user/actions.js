import { HTTP } from '../../../plugins/axios.js'


import API from '../../../utils/API.js'
export default {
  async createWallet ({ commit }, passphrase) {
    console.log('in createWallet action')
    commit('clearError')
    commit('setLoading', true)
    try {
	  const web3 = new Web3('http://134.209.237.111:8545')
	  let publicKey = await web3.eth.personal.newAccount(passphrase)
	  console.log(publicKey)
	  return publicKey
    } catch (e) {
      console.log(e)
	  commit('setError', e)
    } finally {
	  commit('setLoading', false)
    }
  },

  async registerUser ({ commit }, user) {
    console.log('in registerUser action')
    commit('clearError')
    commit('setLoading', true)
    try {
      // Создание пользователя
      console.log(user);
      const response = await HTTP.post(API.method.signup, user);
      commit('setLoading', false)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.response.data)
      throw e
    }
  },
  async authUser ({ commit }, payload) {
    commit('clearError')
    commit('setLoading', true)
    console.log('login user')
    try {
      const response = await HTTP.post(API.method.signin, payload)
      commit('setLoading', false)
      commit('setUser', payload)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.response.data)
      throw e
    }
  },
  async logout ({ commit }) {
    commit('clearError')
    commit('setLoading', true)
    commit('setRenderPermission', false)
    try {
      const response = await HTTP.post(API.method.logout)
      commit('setLoading', false)
      commit('setUser', null)
      commit('setRenderPermission', true)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.response.data)
      commit('setRenderPermission', true)
      throw e
    }
  },
  async restoreUser ({commit}, user) {
	console.log('restoring user account');
	commit('clearError');
	commit('setLoading', true);
	try {
	  console.log(user);
	  const response = await HTTP.post(API.method.restoreUser, user);
	  commit('setLoading', false);
      commit('setUser', response.data);
      commit('setMyVotings', null);
	} catch (e) {
	  commit('setLoading', false);
	  commit('setError', e.response.data);
	  throw e
	}
  },
  async loadUser ({commit}) {
	console.log('loading user');
	commit('setLoading', true);
	try {
	  const response = await HTTP.get(API.method.adminInfo);
	  commit('setUser', response.data)
	} catch (e) {
	  commit('setLoading', false);
	  commit('setError', e.response.data);
	  throw e
	}
  }
}
