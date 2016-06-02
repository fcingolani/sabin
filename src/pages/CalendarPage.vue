<template>
  <div>
    <header>
        <div class="navbar-fixed">
            <nav>
                <div class="nav-wrapper red darken-3 white-text">
                    <ul class="left">
                      <li><a v-link="{ name: 'home' }"><i class="material-icons">&#xE317;</i></a></li>
                      <li class="flow-text">Calendario de Vacunas</li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>

    <main class="container">


      <div class="row">
        <ul class="tabs">
            <li class="tab col s6" v-if="futureDoses.length > 0"><a href="#future">Próximas</a></li>
            <li class="tab col s6" v-if="pastDoses.length > 0"><a href="#past">Anteriores</a></li>
        </ul>
      </div>

      <div class="row" v-if="warn">
       <div class="col s12">
         <div class="card red lighten-5">
           <div class="card-content">
             <span class="card-title">Atención</span>
             <p>Si bien Sabin te ayuda a ver un calendario de vacunación aproximado, <strong>siempre debes consultar a tu médico</strong> por un plan de vacunación adecuado.</p>
             <p>La información de este calendario se obtuvo desde el <a target="_blank" href="{{calendar.source}}">{{calendar.title}} de {{calendar.country}}</a>, actualizado el día {{calendar.updated_at | formatDate}}.</p>
           </div>
           <div class="card-action">
             <a v-on:click="warn = false">Entendido</a>
           </div>
         </div>
       </div>
     </div>

      <div class="row">
        <div id="future">
          <dose-card v-for="dose in futureDoses" :dose="dose"></dose-card>
        </div>
        <div id="past">
          <dose-card v-for="dose in pastDoses" :dose="dose"></dose-card>
        </div>
      </div>

      <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
        <a class="btn-floating btn-large tooltipped red darken-3" data-position="left" data-delay="50" data-tooltip="Guardar en Google Calendar" v-on:click="showModal('import')">
          <i class="material-icons">&#xE2C3;</i>
        </a>
      </div>

      <import-dialog :calendar="calendar" :doses="doses" :birth-date="birthDate"></import-dialog>

    </main>
  </div>

</template>
<script>

import $ from 'jquery'
import _ from 'underscore'
import moment from 'moment'

import CalendarService from 'lib/calendar'

import DoseCard from 'components/DoseCard.vue'
import ImportDialog from 'components/ImportDialog.vue'

export default {

  components: {
    DoseCard,
    ImportDialog
  },

  created() {

    this.calendar = CalendarService[this.country];

  },

  ready() {

    $('.tabs').tabs();
    $('.tabs a').each(function (i, el){
      $(el).off('click');
    });

    $('.tooltipped').tooltip({delay: 50});
  },

  data(){
    return {
      country: this.$route.params.country,
      birthDate: this.$route.params.birthDate,
      calendar: null,
      warn: true
    };
  },

  computed: {

    url() {
      return window.document.location.href;
    },

    _birthDateMoment() {
      return moment(this.birthDate, "YYYY-MM-DD");
    },

    today() {
      return moment({hour: 0});
    },

    doses() {

      let doses = [];

      for(let vaccine of this.calendar.vaccines){

        for(let vaccineDose of vaccine.doses){

          let dose = _.clone(vaccineDose);

          dose.vaccine = vaccine;

          if(vaccineDose.atSchool) {

            let lateSchool = this._birthDateMoment.month() < this.calendar.education.classStartMonth - 1;

            dose.from = moment({
              year: this._birthDateMoment.year(),
              month: this.calendar.education.termStartMonth - 2
            }).add({
              years: vaccineDose.from.years + (lateSchool ? 0 : 1)
            });

          }else{

            dose.from = moment(this._birthDateMoment).add(vaccineDose.from);

            if(vaccineDose.to){
              dose.to = moment(this._birthDateMoment).add(vaccineDose.to)
            }

          }

          doses.push(dose);

        }

      }

      return _.sortBy(doses, dose => dose.from.unix() );

    },

    futureDoses() {
      return _.filter(this.doses, dose => dose.from.isSameOrAfter(this.today))
    },

    pastDoses() {
      return _.filter(this.doses, dose => dose.from.isBefore(this.today))
    }

  },

  methods: {

    showModal(id) {
        $('#' + id).openModal();
    }

  },

  filters: {

    formatDate(date) {

      return moment(date).format('DD/MM/YYYY');


    }

  }

}

</script>
<style>
.dose {
  width: 100%;
}

#share {
  max-height: none;
  max-width: 500px;
  margin: 0 auto;
}

#share p {
  margin-top: none;
}

.social-icon {
  width: 25px;
}
</style>
