import store from '@/store/';
export default (to, from, next) => {
  console.log('single unit guard');
  store.dispatch('loadSingleTaskById', to.params.id)
	  .then(() => next())
	  .catch(() => next('/registration?authError=true'));
}
