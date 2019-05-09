import store from '@/store/';
import { HTTP } from '../../plugins/axios.js';
import API from '../../utils/API.js';
export default (to, from, next) => {
  console.log('groups guard');

  store.dispatch('loadCourses')
	  .then(() => {
	    store.dispatch('loadUnits')
			.then(() => {
			  store.dispatch('loadGroups')
				  .then(() => next())
			})
	  })
	  .catch(() => next('/registration?authError=true'))


}
