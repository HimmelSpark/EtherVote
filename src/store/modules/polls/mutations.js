export default {
  setMyVotings(state, votings) {
    state.myVotings = votings;
  },
  setSingleVoting(state, voting) {
    state.voting = voting;
  },
  setAllVotes(state, votes) {
    state.allVotes = votes;
  },
  setPeople(state, people) {
    state.people = people;
  },
  setAllPeople(state, allPeople) {
    state.allPeople = allPeople;
  },
  setChainData(state, chainData) {
    state.chainData = chainData;
  }
}