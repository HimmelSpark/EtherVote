export default {
  registerWeb3Instance (state, payload) {
	console.log('registerWeb3instance Mutation being executed', payload)
	let result = payload
	let web3Copy = {}
	web3Copy.coinbase = result.coinbase
	web3Copy.networkId = result.networkId
	web3Copy.balance = parseInt(result.balance, 10)
	web3Copy.isInjected = result.injectedWeb3
	web3Copy.web3Instance = result.web3
	state.web3 = web3Copy
  }
}