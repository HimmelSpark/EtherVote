// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Components
import './components'
// import ColorPicker from './components/helper/Color';
// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App';
import i18n from '@/i18n';
import router from '@/router';
import store from '@/store';
import { HTTP } from "./plugins/axios.js";
import API from './utils/API.js';
// Sync store with router
sync(store, router);

Vue.config.productionTip = false;
// Vue.component("color-picker", ColorPicker);

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  created () {
      this.$store.commit('setRenderPermission', false);
      const promise = HTTP.get(API.method.adminInfo);
      promise.then(
          resp => {
              console.log(resp.data);
              this.$store.commit('setUser', resp.data);
              this.$store.commit('setRenderPermission', true);
          }
      ).catch(
          (e) => {
            console.log('unauthorized: ', e);
            this.$store.commit('setRenderPermission', true);
          }
      )
  },
}).$mount('#app');
