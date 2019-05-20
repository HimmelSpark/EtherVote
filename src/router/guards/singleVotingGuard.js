import store from '@/store/';

export default async (to, from, next) => {
  console.log('single voting guard');
  store.dispatch('loadVotingById', to.params.id)
	  .then(async () => {
	    const blockKey = store.getters.voting.blockKey;
		let receipt = await store.getters.getWeb3.web3Instance().eth.getTransactionReceipt(blockKey);
		let ballotContract = new store.getters.getWeb3.web3Instance().eth.Contract(store.getters.votingContractJSON, receipt.contractAddress);
		let chainData = {};
		chainData.proposalVotes = [];
		if (receipt) {
		  ballotContract.methods.votersNum().call({from:store.getters.user.publicKey}, (err, res) => {
			chainData.votersNum = Number.parseInt(res._hex);
			let proposalVotes = [];
			for (let i = 0; i < store.getters.voting.variants.length; i++) {
			  ballotContract.methods.proposalVotes(i).call({from:store.getters.user.publicKey}, (err, res) => {
				proposalVotes.push(Number.parseInt(res._hex));
			  });
			  chainData.proposalVotes = proposalVotes;
			}
			ballotContract.methods.winningProposal().call({from:store.getters.user.publicKey}, (err, res) => {
			  chainData.winningProposal = res;
			});
		  });

		  store.dispatch('updateChainData', chainData);
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