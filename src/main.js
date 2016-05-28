import './plugins.js'

import ga from 'ga'

import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage     from 'pages/HomePage.vue'
import CalendarPage from 'pages/CalendarPage.vue'

var router = new VueRouter()

let App = Vue.extend({
  template: '<div><router-view></router-view></div>'
});

router.map({

    '/': {
      name: 'home',
      component: HomePage
    },

    '/calendar/:country/:birthDate': {
      name: 'calendar',
      component: CalendarPage
    }

})

router.afterEach(function (transition) {
  ga('set', 'page', transition.to.path);
  ga('send', 'pageview');
})

router.start(App, '#app')
