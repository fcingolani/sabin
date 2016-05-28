<template>
  <div class="col m6 dose">
    <div class="card">
        <div class="card-content">
            <h6 class="grey-text text-lighten-1">{{ dose.from | relative | ucfirst }}</h6>
            <span class="card-title">{{ dose.title }} de {{ dose.vaccine.name }}</span>
            <div class="section" v-if="dose.description">
                <p>{{ dose.description }}</p>
            </div>
            <div class="divider"></div>
            <div class="section">
                <p>
                    <i class="tiny material-icons">event</i> {{ dose.from.format("DD/MM/YYYY") }}
                    <span v-if="dose.to">al {{ dose.to.format("DD/MM/YYYY") }}</span>
                </p>
                <p v-if="dose.vaccine.description">{{ dose.vaccine.description }}</p>
                <p v-if="dose.vaccine.warning"><i class="tiny material-icons">warning</i> {{ dose.vaccine.warning }}</p>
                <p v-if="dose.vaccine.protectsFrom"><i class="tiny material-icons">bug_report</i> {{ dose.vaccine.protectsFrom }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {

  name: 'DoseCard',

  props: {
    dose: Object
  },

  filters: {

    ucfirst: str => str.charAt(0).toUpperCase() + str.substr(1),

    relative: (date) => {

      let today = moment({hour: 0});

      let duration = moment.duration(date.diff(today));

      let days = duration.asDays();

      if(days === 0){
        return "Hoy";
      }if(days === 1){
        return "Mañana";
      }else{
        return date.fromNow();
      }

    }

  }

}
</script>

<style>

</style>
