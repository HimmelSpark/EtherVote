import store from '@/store/';

export default (to, from, next) => {
  console.log('toVote guard');

  if (store.getters.user) {
	store.dispatch('loadAllVotes')
		.then(() => next())
		.catch(() => next('/login'))
  } else {
    store.dispatch('loadUser')
		.then(() => {
		  store.dispatch('loadAllVotes').then(() => next())
		})
		.catch(() => {
		  store.dispatch('setError', 'Доступ закрыт!');
		  next('/login')
		})
  }
}