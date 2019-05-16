import API from "../../../utils/API";
import {HTTP} from "../../../plugins/axios";

export default {
  async createVote({commit}, voting) {
	console.log('in_action: creating vote');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.createVoting, voting);
	  console.log(response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	}
  },
  async loadMyVotings({commit}) {
	console.log('in_action: load myVote');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.loadMyVotings);
	  console.log(response.data);
	  commit("setLoading", false);
	  commit("setMyVotings", response.data)
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	}
  }
}