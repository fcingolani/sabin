<template>

  <div class="date-picker row">
    <div class="col s3">
      <select class="browser-default" v-model="day">
        <option value="" disabled selected>Día</option>
        <option v-for="day in days">{{day}}</option>
      </select>
    </div>
    <div class="col s5">
      <select class="browser-default" v-model="month">
        <option value="-1" disabled selected>Mes</option>
        <option v-for="month in months"  v-bind:value="month.number">{{month.name}}</option>
      </select>
    </div>
    <div class="col s4">
      <select class="browser-default" v-model="year">
        <option value="" disabled selected>Año</option>
        <option v-for="year in years">{{year}}</option>
      </select>
    </div>
  </div>

</template>

<script>

import _ from 'underscore'
import moment from 'moment'

import now from 'lib/now'

export default {

  props: {
    date: String
  },

  data() {
    return {
      days: _.range(1, 32),
      months: _.map(moment.months(), function (v, i){
        return {
          number: i,
          name: v
        }
      }),
      years: _.range(1950, now.year() + 1).reverse(),
      day: null,
      month: null,
      year: null
    }
  },

  computed: {

    date() {
      let that = this;

      if(!that.day || that.month === null || !that.year) {
        return null;
      }

      let date = moment({
        day: that.day,
        month: that.month,
        year: that.year
      });

      return date.isValid() ? date.format('YYYY-MM-DD') : null;
    }

  }

}

</script>

<style>

</style>
