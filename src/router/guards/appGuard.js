import store from '@/store/';
import { HTTP } from '../../plugins/axios.js';
import API from '../../utils/API.js';
export default (to, from, next) => {
  console.log('app-guard');
  store.dispatch('loadSchool')
	  .then(() => next())
	  .catch(() => next('/registration?authError=true'))
}
