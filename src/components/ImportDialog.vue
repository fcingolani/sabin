<template>
  <div id="import" class="modal">

    <div v-show="state == 'loading'" class="loading">
      <div class="modal-content">
        <div class="valign-wrapper">
          <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
          <p class="valign">Cargando...</p>
        </div>
      </div>
    </div>

    <div v-show="state == 'login'">
      <div class="modal-content">
        <h4>Importar</h4>
        <p>Puedes importar este calendario a tu Google Calendar para tenerlo siempre contigo y recibir alertas automáticamente para que no olvides ninguna vacuna. Para ello debes iniciar sesión con tu cuenta de Google.</p>
      </div>
      <div class="modal-footer">
        <a class=" modal-action waves-effect waves-green btn-flat" v-on:click="login()">Iniciar Sesión</a>
      </div>
    </div>

    <div v-show="state == 'create'">
      <div class="modal-content">
        <h4>Crear Calendario</h4>
        <p>Antes de importarlo, puedes elegir un nombre de calendario a continuación para identificarlo luego en tu cuenta de Google.</p>
        <div class="input-field col s6">
          <input placeholder="Nombre del Calendario" id="calendar-name" type="text" v-model="calendarName">
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-action waves-effect waves-green btn-flat" v-on:click="save()">Importar</a>
      </div>
    </div>

    <div v-show="state == 'importing'" class="loading">
      <div class="modal-content">
        <div class="valign-wrapper">
          <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div>
          <p class="valign">Importando...</p>
        </div>
      </div>
    </div>

    <div v-show="state == 'done'">
      <div class="modal-content">
        <h4>Listo</h4>
        <p>Tu calendario ya ha sido importado a tu cuenta de Google.</p>
      </div>
      <div class="modal-footer">
        <a class="modal-action modal-close waves-effect waves-green btn-flat" v-on:click="state = 'create'">Cerrar</a>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import gapiPromise from 'lib/gapiPromise'

export default {

  props: {
    calendar: Object,
    birthDate: String,
    doses: Array
  },

  data: function (){
    return  {
      state: 'loading'
    }
  },

  created: function () {

    this.calendarName = 'Vacunas de ' + this.birthDate;

  },

  ready: function () {
    var that = this;

    gapiPromise.then(function (gapi){

      gapi.auth.authorize({
        'client_id': '528253868560-s8arjvfek62f427dta38ecfvgk7fci92.apps.googleusercontent.com',
        'scope': "https://www.googleapis.com/auth/calendar",
        'immediate': true
      }, that.handleLogin);

    })
  },

  methods: {

    login: function (){
      var that = this;

      gapiPromise.then(function (gapi){

        gapi.auth.authorize({
          'client_id': '528253868560-s8arjvfek62f427dta38ecfvgk7fci92.apps.googleusercontent.com',
          'scope': "https://www.googleapis.com/auth/calendar",
          'immediate': false
        }, that.handleLogin);

      });

    },

    save: function () {

      var that = this;

      this.state = 'importing';

      gapiPromise.then(function (gapi){

        gapi.client.calendar.calendars.insert({
          summary: that.calendarName
        }).then(function(response) {

          let calendar = response.result;

          let batch = gapi.client.newBatch();

          _.each(that.doses, function (dose){

            let description = [
              dose.description,
              dose.vaccine.description,
              'Protege contra: ' + dose.vaccine.protectsFrom,
              dose.vaccine.warning
            ];

            let resource = {
              summary: dose.title + ' de ' + dose.vaccine.name,
              description: description.join("\n"),
              start: {
                date: dose.from.format('YYYY-MM-DD')
              },
              end: {
                date: (dose.to || dose.from).format('YYYY-MM-DD')
              },
              reminders: {
                useDefault: false,
                overrides: [
                  {
                    method: 'email',
                    minutes: 1440 // 1 day
                  },
                  {
                    method: 'email',
                    minutes: 10080 // 1 week
                  }
                ]
             }
            };

            batch.add(gapi.client.calendar.events.insert({
              calendarId: calendar.id,
              resource: resource
            }));
          })

          batch.then(function (res){

            that.state = 'done';

          }, function (reason){ console.warn(reason); });

        }, function (reason){ console.warn(reason); });

      });

    },

    handleLogin: function (response){
      var that = this;

      gapiPromise.then(function (gapi){

        if(!response || response.error != null){

          that.state = 'login';

        }else{

          gapi.client.load('calendar', 'v3').then(function (){
            that.state = 'create';
          });

        }
      })

    }

  }

}

</script>

<style>

#import .loading p {
  margin-left: 20px;
}

</style>
