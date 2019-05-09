import store from '@/store/';
export default (to, from, next) => {
  console.log('single course guard');
  store.dispatch('loadSingleCourseById', to.params.id)
	  .then(() => {
	    store.dispatch('loadUnitsByCourseId', to.params.id)
			.then(() => next())
	  })
	  .catch(() => next('/registration?authError=true'));
}
