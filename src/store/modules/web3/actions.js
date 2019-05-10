import getWeb3 from '../../../../ethereum/getWeb3'

export default {
  registerWeb3 ({ commit }) {
    console.log('registerWeb3 Action being executed')
    getWeb3.then(result => {
	  console.log('committing result to registerWeb3Instance mutation', result)
	  commit('registerWeb3Instance', result)
    }).catch(e => {
	  console.log('error in action registerWeb3', e)
    })
  }
}
