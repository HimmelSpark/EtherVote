import store from '@/store/index.js';

export default (to, from, next) => {
  /**
   * курсы нужны для создания групп
   * группы нужны для создания студентов
   * студенты нужны по логике 👌
   */
  console.log('call students guard');
  //todo проверять авторизацию
  store.dispatch('loadCourses')
	  .then(() => {
		store.dispatch('loadGroups')
			.then(() => {
			  store.dispatch('loadStudents')
				  .then(() => next())
				  .catch(() => next('/'));
			})
			.catch(() => next('/'));
	  })
	  .catch(() => next('/'));
}
