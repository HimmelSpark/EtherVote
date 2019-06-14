import Web3 from 'web3'
import store from '@/store/';

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/

let getWeb3 = new Promise(function (resolve, reject) {
  // Check for injected web3 (mist/metamask)
  // var web3 = new Web3(new Web3.providers.HttpProvider('http://134.209.237.111:8545'));
  // let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
  let web3 = new Web3('https://voterf.ml/blockchain');
  resolve({
	injectedWeb3: web3.isConnected,
	web3() {
	  return web3
	}
  });
  reject(() => {
    store.dispatch('setError', "Сеть блокчейна недоступна")
  })
})
	.then(result => {
	  return new Promise(function (resolve, reject) {
		// Retrieve network ID
		result.web3().eth.net.getId((err, networkId) => {
		  if (err) {
			// If we can't find a networkId keep result the same and reject the promise
			reject(new Error('Unable to retrieve network ID'))
		  } else {
			// Assign the networkId property to our result and resolve promise
			result = Object.assign({}, result, {networkId})
			resolve(result)
		  }
		})
	  })
	})
	.then(result => {
	  return new Promise(function (resolve, reject) {
		// Retrieve coinbase
		result.web3().eth.getCoinbase((err, coinbase) => {
		  if (err) {
			reject(new Error('Unable to retrieve coinbase'))
		  } else {
			result = Object.assign({}, result, {coinbase})
			resolve(result)
		  }
		})
	  })
	})
	.then(result => {
	  return new Promise(function (resolve, reject) {
		// Retrieve balance for coinbase
		result.web3().eth.getBalance(result.coinbase, (err, balance) => {
		  if (err) {
			reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
		  } else {
			result = Object.assign({}, result, {balance})
			resolve(result)
		  }
		})
	  })
	});

export default getWeb3
