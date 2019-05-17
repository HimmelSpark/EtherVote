<template>
  <v-app>

    <core-toolbar />

    <template v-if="isUserLoggedIn">
      <core-drawer />
    </template>

    <core-view />

    <template v-if="errorMessage">
      <v-snackbar
          :timeout="5000"
          :multi-line="true"
          :color="info"
          :value="true"
          @input="closeError"
      >
        {{ errorMessage }}
        <v-btn
            flat
            color="error"
            @click.native="closeError"> Close
        </v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>

<script>

import getWeb3 from '../ethereum/getWeb3'

export default {
  computed: {
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    },
    errorMessage() {
      return this.$store.getters.error
    }
  },
  methods: {
    closeError() {
      this.$store.commit('clearError')
    }
  },
  beforeCreate() {
	  console.log('registerWeb3 Action dispatched from App.vue');
	  this.$store.dispatch('registerWeb3')
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
