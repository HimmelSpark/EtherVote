import store from '@/store/';
import {HTTP} from "../../plugins/axios";
import API from '../../utils/API.js';
export default (to, from, next) => {
  console.log('already-auth-guard');
  if (store.getters.user) {
    next('/');
  } else {
    store.commit('setRenderPermission', false);
	HTTP.get(API.method.adminInfo)
		.then(resp => {
		  const user = resp.data;
		  store.commit('setUser', user);
		  store.commit('setRenderPermission', true);
		  next('/');
		})
		.catch(e => {
		  console.log('unauthorized: ', e);
		  store.commit('setRenderPermission', true);
		  next();
		});
  }
}
