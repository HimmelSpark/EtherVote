import { HTTP } from "../../../plugins/axios.js";
import API from '../../../utils/API.js';
export default {
    async registerUser({commit}, payload) {
        console.log('in registerUser action');
        commit('clearError');
        commit('setLoading', true);
        const data = payload.user;
        data.schoolName = payload.schoolName;
        try {
            // Создание пользователя
            const response = await HTTP.post(API.method.signup, data);
            commit('setLoading', false);
            commit('setUser', data);
            commit('setSchool', data.schoolName);
        } catch (e) {
            commit('setLoading', false);
            commit('setError', e.response.data);
            throw e;
        }

    },
    async authUser({ commit }, payload) {
        commit("clearError");
        commit("setLoading", true);
        console.log("login user");
        try {
            const response = await HTTP.post(API.method.signin, payload);
            commit("setLoading", false);
            commit("setUser", payload);
        } catch (e) {
            commit("setLoading", false);
            commit("setError", e.response.data);
            throw e;
        }
    },
    async logout({commit}) {
        commit("clearError");
        commit("setLoading", true);
        commit('setRenderPermission', false);
        try {
            const response = await HTTP.post(API.method.logout);
            commit("setLoading", false);
            commit("setUser", null);
            commit('setRenderPermission', true);
        } catch (e) {
            commit("setLoading", false);
            commit("setError", e.response.data);
            commit('setRenderPermission', true);
            throw e;
        }
    }
}
