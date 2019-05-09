import { HTTP } from "../../../plugins/axios.js";
import API from '../../../utils/API.js';
export default {
  async loadUnitsByCourseId ({commit}, id) {
    console.log('loadUnitsByCourseId');
    commit('clearError');
	commit("setLoading", true);
    try {
      const response = await HTTP.get(API.method.courseUnitsById + id);
	  commit("setLoading", false);
      commit('setUnits', response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async loadUnits({commit}) {
	console.log('loadAllUnits');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.allUnits);
	  commit("setLoading", false);
	  commit('setUnits', response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async createUnit ({commit}, payload) {
	console.log('createUnit');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.createUnit, payload);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async loadSingleUnitById ({commit}, id) {
    console.log('loadSingleUnitById');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.unitById + id);
	  console.log(response.data);
	  commit('setUnit', response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async deleteUnitById ({commit}, id) {
    console.log('deleteUnitById');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.deleteUnit, id);
	  console.log(response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async changeUnit ({commit}, id) {
	console.log('changeUnit');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.changeUnit, id);
	  console.log(response.data);
	} catch (e) {
	  commit('setError', e.response.data);
	  throw e;
	} finally {
	  commit('setLoading', false);
	}
  }
}
