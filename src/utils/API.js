
const baseUrl = 'http://localhost:8090/';

const method = {
  signin: 'user/auth',
  signup: 'user/register',
  logout: 'user/logout',
  adminInfo: 'user/info',
  restoreUser: 'user/change',

  createVoting: 'voting/create',
  loadMyVotings: 'voting/get/user',
  getVotingById: 'voting/get/',
  addUserToVote: 'voting/add',

  loadAllVotes: 'voting/get/',
  loadPeopleByVoteId: 'voting/get/', //${1}/users
  loadAllPeople: 'user/get',
};

export default {baseUrl, method};
