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
            v-if="responsive"
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
        <!--<v-text-field-->
        <!--v-if="responsiveInput"-->
        <!--class="mr-4 mt-2 purple-input"-->
        <!--label="Search..."-->
        <!--hide-details-->
        <!--color="purple"/>-->
        <!--<router-link-->
        <!--v-for="link in links"-->
        <!--:key="link.title"-->
        <!--v-ripple-->
        <!--class="toolbar-items"-->
        <!--:to="link.url"-->
        <!--@click="link.onClick">-->
        <!--<v-icon color="tertiary">{{ link.icon }}</v-icon>-->
        <!--</router-link>-->

        <template
            v-for="link in links"
            class="toolbar-items">
          <v-btn
              icon
              :key="link.title"
              :to="link.url"
              @click="link.onClick"
          >
            <v-icon color="tertiary">{{ link.icon }}</v-icon>
          </v-btn>
        </template>

        <!--<v-menu-->
        <!--bottom-->
        <!--left-->
        <!--content-class="dropdown-menu"-->
        <!--offset-y-->
        <!--transition="slide-y-transition">-->
        <!--<router-link-->
        <!--v-ripple-->
        <!--slot="activator"-->
        <!--class="toolbar-items"-->
        <!--to="/notifications">-->
        <!--<v-badge-->
        <!--color="error"-->
        <!--overlap>-->
        <!--<template slot="badge">-->
        <!--{{ notifications.length }}-->
        <!--</template>-->
        <!--<v-icon color="tertiary">mdi-bell</v-icon>-->
        <!--</v-badge>-->
        <!--</router-link>-->
        <!--<v-card>-->
        <!--<v-list dense>-->
        <!--<v-list-tile-->
        <!--v-for="notification in notifications"-->
        <!--:key="notification"-->
        <!--@click="onClick"-->
        <!--&gt;-->
        <!--<v-list-tile-title-->
        <!--v-text="notification"-->
        <!--/>-->
        <!--</v-list-tile>-->
        <!--</v-list>-->
        <!--</v-card>-->
        <!--</v-menu>-->
        <!--<router-link-->
        <!--v-ripple-->
        <!--class="toolbar-items"-->
        <!--to="/login">-->
        <!--<v-icon color="tertiary">mdi-account-remove</v-icon>-->
        <!--</router-link>-->
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
	  links() {
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
	  isUserLoggedIn() {
		return this.$store.getters.isUserLoggedIn;
	  },
	  renderPermission() {
		return this.$store.getters.renderPermission;
	  },
	  errorMessage() {
		return this.$store.getters.error;
	  },
	  user() {
		return this.$store.getters.user;
	  }
	},
	watch: {
	  '$route'(val) {
		this.title = val.name
	  }
	},

	mounted() {
	  this.onResponsiveInverted();
	  window.addEventListener('resize', this.onResponsiveInverted)
	},
	beforeDestroy() {
	  window.removeEventListener('resize', this.onResponsiveInverted)
	},

	methods: {
	  ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
	  onClickBtn() {
		this.setDrawer(!this.$store.state.app.drawer)
	  },
	  onClick() {
		//
	  },
	  onResponsiveInverted() {
		if (window.innerWidth < 991) {
		  this.responsive = true;
		  this.responsiveInput = false
		} else {
		  this.responsive = false;
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
