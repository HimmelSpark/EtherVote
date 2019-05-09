import API from "../../../utils/API";
import {HTTP} from "../../../plugins/axios";

export default {
  async loadSchool({commit}) {
	console.log('loading school');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.loadSchool);
	  console.log(response.data);
	  commit("setLoading", false);
	  commit("setSchool", response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async saveApplication({commit}, school) {
	console.log('saveApplication');
	try {
	  commit('setLoading', true);
	  const response = await HTTP.post(API.method.saveSchool, school);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit('setError', e.response.data);
	  throw e;
	} finally {
	  commit('setLoading', false);
	}
  },
}