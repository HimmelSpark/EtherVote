import {HTTP} from "../../../plugins/axios.js";
import API from '../../../utils/API.js';

export default {
  async createCourse({commit}, payload) {
	console.log('createCourse');
	if (payload != null) {
	  commit('clearError');
	  commit('setLoading', true);
	  try {
		// Создание курса
		const response = await HTTP.post(API.method.createCourse, payload);
		console.log("creating course  -  ", response.data);
	  } catch (e) {
		commit('setError', e.response.data);
		throw e;
	  } finally {
		commit('setLoading', false);
	  }
	}
  },
  async loadCourses({commit}) {
	console.log('loadCourses');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.schoolCourses);
	  commit("setLoading", false);
	  commit("setCourses", response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async loadSingleCourseById({commit}, id) {
    console.log('loadSingleCourse');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.get(API.method.schoolCourses + id);
	  console.log(response.data);
	  commit("setLoading", false);
	  commit("setSingleCourse", response.data);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async deleteCourseById({commit}, id) {
    console.log('deleteCourseById');
	commit("clearError");
	commit("setLoading", true);
	try {
	  const response = await HTTP.post(API.method.deleteCourse, id);
	  console.log(response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async changeCourseImage ({commit}, {img, id}) {
	console.log('changeAva');
	commit('clearError');
	commit('setLoading', true);
	const formData = new FormData();
	formData.append('image', img);
	formData.append('id', id);
	try {
	  const response = await HTTP.post(API.method.changeCourseImage, formData);
	  console.log(response.data);
	  commit("setLoading", false);
	} catch (e) {
	  commit("setLoading", false);
	  console.log(e);
	  commit("setError", e.response.data);
	  throw e;
	}
  },
  async changeCourse ({commit}, payload) {
	console.log('changeCourse');
	commit('clearError');
	commit('setLoading', true);
	try {
	  const response = await HTTP.post(API.method.changeCourse, payload);
	  console.log(response.data);
	} catch (e) {
	  commit('setError', e.response.data);
	  throw e;
	} finally {
	  commit('setLoading', false);
	}
  }
}
