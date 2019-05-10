<template>
  <v-app>
    <core-filter />

    <core-toolbar />

    <template v-if="isUserLoggedIn">
      <core-drawer />
    </template>

    <core-view />

  </v-app>
</template>

<script>

import getWeb3 from '../ethereum/getWeb3'

export default {
  computed: {
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
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
