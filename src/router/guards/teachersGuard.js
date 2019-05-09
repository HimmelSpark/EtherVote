import store from '@/store/index.js';

export default (to, from, next) => {
  console.log('call teachers\' guard');
  //todo проверять авторизацию
  store.dispatch('loadTeachers')
	  .then(() => next())
	  .catch(() => next('/registration?authError=true'))
}
