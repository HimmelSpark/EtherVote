<!--suppress HtmlUnknownTag, CheckEmptyScriptTag -->
<template>
  <v-toolbar
    id="core-toolbar"
    flat
    prominent
    style="background: #eee;"
  >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light">
        <v-btn
          v-if="responsive && isUserLoggedIn"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="onClickBtn">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>

    <v-spacer/>

    <v-toolbar-items>
      <v-flex
        align-center
        layout
        py-2>

        <template
          v-for="link in links"
          class="toolbar-items">
          <v-btn
            :key="link.title"
            :to="link.url"
            icon
            @click="link.onClick"
          >
            <v-icon
              left
              color="tertiary">{{ link.icon }}</v-icon>
          </v-btn>
        </template>

      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

import {
  mapMutations
} from 'vuex'

export default {
  data: () => ({
	  notifications: [
      'Mike, John responded to your email',
      'You have 5 new tasks',
      'You\'re now a friend with Andrew',
      'Another Notification',
      'Another One'
	  ],
	  title: null,
	  responsive: false,
	  responsiveInput: false
  }),
  computed: {
	  links () {
		if (this.isUserLoggedIn) {
		  return [
			{
			  title: "logout", icon: "mdi-account-off", url: "/", onClick: () => {
				this.$store.dispatch('logout')
			  }
			}
		  ];
		} else {
	  return [
		{
		  title: "login", icon: "mdi-account", url: "/login", onClick: () => {
		  }
		}
	  ];
	}
	  },
	  isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
	  },
	  renderPermission () {
      return this.$store.getters.renderPermission
	  },
	  errorMessage () {
      return this.$store.getters.error
	  },
	  user () {
      return this.$store.getters.user
	  }
  },
  watch: {
	  '$route' (val) {
      this.title = val.name
	  }
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
	  onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
	  },
	  onClick () {
      //
	  },
	  onResponsiveInverted () {
      if (window.innerWidth < 991) {
		  this.responsive = true
		  this.responsiveInput = false
      } else {
		  this.responsive = false
		  this.responsiveInput = true
      }
	  }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
