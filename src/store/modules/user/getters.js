export default {
    user(state) {
        return state.user;
    },
    isUserLoggedIn(state) {
        return state.user !== null;
    }

}
