export default {
  setMyVotings(state, votings) {
    state.myVotings = votings;
  },
  setSingleVoting(state, voting) {
    state.voting = voting;
  },
  setAllVotes(state, votes) {
    state.allVotes = votes;
  }
}