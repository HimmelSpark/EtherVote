import { HTTP } from "../../../plugins/axios.js";
import API from '../../../utils/API.js';
export default {
  async loadTasksByUnitId ({commit}, id) {
	console.log('loadTasksByUnitId');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.tasksByUnitId + id);
	  commit("setLoading", false);
	  console.log(response.data);
	  commit('setTasks', response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async loadSingleTaskById ({commit}, id) {
	console.log('loadSingleTaskById');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.taskById + id);
	  commit("setLoading", false);
	  console.log(response.data);
	  commit('setTask', response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async createTask ({commit}, payload) {
	console.log('createTask');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.createTask, payload);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async editTask ({commit}, payload) {
	console.log('editTask');
	commit('clearError');
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.editTask, payload);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async deleteTaskById ({commit}, id) {
	console.log('deleteTaskById');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.deleteTask, id);
	  console.log(response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  }
}
