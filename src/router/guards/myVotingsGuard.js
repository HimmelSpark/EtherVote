import store from '@/store/';
import { HTTP } from '../../plugins/axios.js';
import API from '../../utils/API.js';

export default (to, from, next) => {
  console.log('myVotings-guard');
  if (store.getters.user) {
    store.dispatch('loadMyVotings')
		.then(() => next())
		.catch(() => next('/login'))
  } else {
    store.dispatch('loadUser')
		.then(() => {
		  store.dispatch('loadMyVotings').then(() => next())
		})
		.catch(() => {
		  store.dispatch('setError', 'Доступ закрыт!');
		  next('/login')
		});
  }
}