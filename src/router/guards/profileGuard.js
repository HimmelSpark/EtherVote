import store from '@/store/';
import { HTTP } from '../../plugins/axios.js';

export default (to, from, next) => {
  console.log('profileGuard');
  if (store.getters.user && store.getters.user.publicKey) {
  	next();
  }
  else {
	  store.dispatch('loadUser')
		  .then(() => next())
		  .catch((e) => {
		    console.log(e);
			next('/registration?authError=true');
		  })
  }
}