import store from '@/store/';
export default (to, from, next) => {
  console.log('call courses guard');
  /**
   * Проверка на авторизацию проходит автоматически,
   * т.к., если мы не авторизованы, то курсы мы полчить не сможем.
   * Главное в action явно кидать исключение, чтобы здесь в блоке catch его ловить.
   */
  store.dispatch('loadCourses')
      .then(() => next())
      .catch(() => next('/registration?authError=true'));
}
