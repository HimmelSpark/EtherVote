// Lib imports
import Vue from 'vue'
import Router from 'vue-router'

import MyVotings from '../views/MyVotings'
import Dashboard from '../views/Dashboard'
import UserProfile from '../views/UserProfile'
import Login from '../views/Login'
import Registration from '../views/Registration'
// guards
import AlreadyAuthGuard from './guards/alreadyAuthGuard.js'
import MyVotingsGuard from './guards/myVotingsGuard';

Vue.use(Router);

// Create a new router
const router = new Router({
  mode: 'history',
  routes: [
    {
	  path: '*',
	  redirect: '/dashboard'
    },
    {
	  path: '/dashboard',
	  // Relative to /src/views
	  component: Dashboard
    },
    {
	  path: '/user-profile',
	  name: 'User Profile',
	  component: UserProfile
    },
    {
	  path: '/login',
	  name: 'Login',
	  component: Login,
	  beforeEnter: AlreadyAuthGuard
    },
    {
	  path: '/registration',
	  name: 'Registration',
	  component: Registration,
	  beforeEnter: AlreadyAuthGuard
    },
    {
	  path: '/votings',
	  name: 'My Votings',
	  component: MyVotings,
	  beforeEnter: MyVotingsGuard
    }
  ]
});
export default router
