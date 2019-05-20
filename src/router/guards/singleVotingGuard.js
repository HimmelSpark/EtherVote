import store from '@/store/';

export default async (to, from, next) => {
  console.log('single voting guard');
  store.dispatch('loadVotingById', to.params.id)
	  .then(async () => {
	    const blockKey = store.getters.voting.blockKey;
		let receipt = await store.getters.getWeb3.web3Instance().eth.getTransactionReceipt(blockKey)
		console.log(receipt);
		if (receipt) {
		  store.dispatch('loadPeopleByVoteId', to.params.id)
			  .then(() => store.dispatch('loadAllPeople')
				  .then(() => next()))
		} else {
		  store.dispatch('setError', 'Голосование пока не обработано блокчейном');
		  console.log(from);
		  next(from)
		}
	  })
}