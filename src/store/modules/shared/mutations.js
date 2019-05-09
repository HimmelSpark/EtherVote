export default {
    setLoading(state, payload) {
        state.loading = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
    clearError(state) {
        state.error = null;
    },
    setRenderPermission(state, payload) {
        state.renderPermission = payload;
    }
}
