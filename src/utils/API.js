
const baseUrl = 'http://localhost:8090/';

const method = {
  signin: 'user/auth',
  signup: 'user/register',
  logout: 'user/logout',
  adminInfo: 'user/info',
  createVoting: 'voting/create',
  loadMyVotings: 'voting/get/user'
};

export default {baseUrl, method};
