<template>
  <div class="home-page">
    <main>
      <div class="container">
        <div class="logo row valign-wrapper red darken-3 white-text">
          <div class="col l12 valign">
            <h1>Sabin</h1>
            <p class="flow-text">Vacunándonos nos protegemos entre todos.</p>
          </div>
        </div>
        <div class="row">
          <div class="col l12">Ingresa la fecha de nacimiento y el país a continuación para obtener un calendario de vacunación personalizado.</div>
        </div>

        <date-picker :date.sync="birthDate"></date-picker>

        <div class="row" v-if="countries.length > 1">
          <div class="col s12 input-field">
            <select class="browser-default" id="country" v-model="country">
              <option value="" disabled selected>País</option>
              <option v-for="country in countries" v-bind:value="country.code">{{ country.name }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col s12 input-field">
            <a class="waves-effect waves-light right btn red darken-3 white-text" v-on:click="goToCalendar" v-bind:class="{disabled: !isValid()}">Ver calendario</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'underscore'

import DatePicker from 'components/DatePicker.vue'

import CalendarService from 'lib/calendar'

export default {

  components: {
    DatePicker
  },

  data() {
    return {
      birthDate: null,
      country: null
    };
  },

  ready() {
    let that = this;

    if(this.countries.length == 1) {
      this.country = this.countries[0].code;
    }
  },

  computed: {

    countries() {
      return _.map(CalendarService, (value, key, list) => {
        return { code: key, name: value.country }
      });
    }

  },

  methods: {

    goToCalendar() {

      if(this.isValid()){
        this.$router.go({
          name: 'calendar',
          params: {
            country: this.country,
            birthDate: this.birthDate
          }
        });
      }

    },

    isValid() {
      return this.country && this.birthDate;
    }

  }

}
</script>

<style>
.home-page .logo {
  display: flex; flex: 1;
}
</style>
