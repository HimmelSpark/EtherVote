import store from '@/store/';

export default async (to, from, next) => {
  console.log('single voting guard');
  if (store.getters.getWeb3 === null) {
    next('/')
  }
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

			if (store.getters.voting.variants.length > 0) {
			  ballotContract.methods.proposalVotes(0).call({from:store.getters.user.publicKey}, (err, res) => {
				proposalVotes.push(Number.parseInt(res._hex));
				if (store.getters.voting.variants.length > 1) {
				  ballotContract.methods.proposalVotes(1).call({from:store.getters.user.publicKey}, (err, res) => {
					proposalVotes.push(Number.parseInt(res._hex));
					if (store.getters.voting.variants.length > 2) {
					  ballotContract.methods.proposalVotes(2).call({from:store.getters.user.publicKey}, (err, res) => {
						proposalVotes.push(Number.parseInt(res._hex));
						if (store.getters.voting.variants.length > 3) {
						  ballotContract.methods.proposalVotes(3).call({from:store.getters.user.publicKey}, (err, res) => {
							proposalVotes.push(Number.parseInt(res._hex));
						  });
						}
					  });
					}
				  });
				}
			  });
			}
			chainData.proposalVotes = proposalVotes;
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