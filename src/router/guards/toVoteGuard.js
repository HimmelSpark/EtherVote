import store from '@/store/';

export default (to, from, next) => {
  console.log('toVote guard');
  store.dispatch('loadAllVotes')
	  .then(() => next())
}