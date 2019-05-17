import store from '@/store/';

export default (to, from, next) => {
  console.log('single voting guard');
  store.dispatch('loadVotingById', to.params.id)
	  .then(() => next())
}