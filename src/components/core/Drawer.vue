<!--suppress ALL -->

<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >

      <v-layout
        class="fill-height"
        tag="v-list"
        column>
        <v-list-tile>
          <v-list-tile-title class="title" v-if="isUserLoggedIn">
            {{user.email}}
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="link.text"/>
        </v-list-tile>
      </v-layout>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    links: [
      {
        to: '/user-profile',
        icon: 'mdi-account',
        text: 'Профиль'
      },
      {
        to: '/votings',
        icon: 'mdi-assistant',
        text: 'Мои голосования'
      },
      {
        to: '/votes',
        icon: 'how_to_vote',
        text: 'Проголосовать'
      }
    ],
    responsive: false
  }),
  computed: {
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    },
    networkId() {
      return this.$store.getters.getWeb3.networkId
    },
    user() {
      return this.$store.getters.user
    },
	...mapState('app', ['image', 'color']),
	inputValue: {
	  get () {
		return this.$store.state.app.drawer
	  },
	  set (val) {
		this.setDrawer(val)
	  }
	},
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
	...mapMutations('app', ['setDrawer', 'toggleDrawer']),
	onResponsiveInverted () {
	  if (window.innerWidth < 991) {
		this.responsive = true
	  } else {
		this.responsive = false
	  }
	}
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
