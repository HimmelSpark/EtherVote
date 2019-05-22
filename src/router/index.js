// Lib imports
import Vue from 'vue'
import Router from 'vue-router'

import MyVotings from '../views/MyVotings'
import Dashboard from '../views/Dashboard'
import UserProfile from '../views/UserProfile'
import Login from '../views/Login'
import Registration from '../views/Registration'
import VotingPage from '../views/VotingPage'
import ToVote from '../views/ToVote'
// guards
import AlreadyAuthGuard from './guards/alreadyAuthGuard'
import MyVotingsGuard from './guards/myVotingsGuard'
import SingleVotingGuard from './guards/singleVotingGuard'
import AllVotesGuard from './guards/toVoteGuard'
import ProfileGuard from './guards/profileGuard'

Vue.use(Router);

// Create a new router
const router = new Router({
  mode: 'history',
  routes: [
    {
	  path: '*',
	  redirect: '/user-profile'
    },
    {
	  path: '/user-profile',
	  name: 'Мой профиль',
	  component: UserProfile,
	  beforeEnter: ProfileGuard,
    },
    {
	  path: '/login',
	  name: 'Авторизация',
	  component: Login,
	  beforeEnter: AlreadyAuthGuard
    },
    {
	  path: '/registration',
	  name: 'Регистрация',
	  component: Registration,
	  beforeEnter: AlreadyAuthGuard
    },
    {
	  path: '/votings',
	  name: 'Мои голосования',
	  component: MyVotings,
	  beforeEnter: MyVotingsGuard
    },
	{
	  path: '/voting/:id',
	  name: 'Информация о голосовании',
	  component: VotingPage,
	  beforeEnter: SingleVotingGuard
	},
	{
	  path: '/votes',
	  name: 'Проголосовать',
	  component: ToVote,
	  beforeEnter: AllVotesGuard
	}
  ]
});
export default router
