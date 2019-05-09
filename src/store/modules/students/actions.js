import API from '../../../utils/API.js';
import {HTTP} from "../../../plugins/axios";

export default {


  async loadGroups({commit}) {
	console.log('loading groups');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.get(API.method.loadGroups);
	  console.log('groups:', response.data);
	  commit('setGroups', response.data)
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async createGroup({commit}, group) {
    console.log('creating group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.createGroup, group);
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async deleteGroup({commit}, id) {
	console.log('deleting group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.deleteGroup, {id: id});
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async changeGroup({commit}, group) {
	console.log('changing group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.changeGroup, group);
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },

  async loadStudents({commit}) {
	console.log('loading students');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.get(API.method.loadAllStudents);
	  console.log('students:', response.data);
	  commit('setStudents', response.data)
	} catch (e) {
	  console.log(e);
	  throw e;
	}
  },
  async loadStudentsByGroupId({commit}, id) {
	console.log('loading students');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.get(API.method.loadStudentsByGroup + id.toString());
	  console.log('students:', response.data);
	  commit('setStudents', response.data)
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async createStudent({commit}, student) {
	console.log('creating group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.createStudent, student);
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async deleteStudent({commit}, id) {
	console.log('creating group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.deleteStudent, {id: id});
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async editStudent({commit}, student) {
	console.log('creating group');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.editStudent, student);
	} catch (e) {
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  }
}