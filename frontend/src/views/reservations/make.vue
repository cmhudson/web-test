<template>
  <div>
    <h3>Make a reservation</h3>
    <div class="res-wrap">
      <label
        >Select time:
        <select v-model="resInstance.start_time">
          <option
            v-for="row in availability"
            v-bind:value="row.start_time"
            v-bind:key="row.start_time"
          >
            {{ row.start_time }}: {{ row.available_reservations }} slots
            available
          </option>
        </select></label
      ><br />
      <label>Name: <input type="text" v-model="resInstance.name"/></label><br />
      <label>Email: <input type="email" v-model="resInstance.email"/></label
      ><br />
      <label
        >Party Size:
        <select v-model="resInstance.party_size">
          <option v-for="i in getPartySizes()" v-bind:key="i" v-bind:value="i"
            >{{ i }}
          </option>
        </select></label
      ><br />
      <div class="errors" v-if="showError">
        <ul>
          <li v-for="(error, key) in errors" v-bind:key="key">
            {{ error }}
          </li>
        </ul>
      </div>
      <button type="submit" v-on:click="saveClicked">create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reservationsMake',
  props: {
    availability: Array
  },
  data: function() {
    return {
      resInstance: {
        start_time: null,
        name: null,
        email: null,
        party_size: 0
      },
      maxPartySize: 8,
      showError: false,
      errors: []
    }
  },
  methods: {
    getPartySizes: function() {
      const array = []
      for (let i = 0; i < this.maxPartySize; i++) {
        array.push(i)
      }
      return array
    },
    saveClicked: function() {
      const payload = this.resInstance
      this.errors = []
      if (payload.name === null) {
        this.errors.push('Name required')
      }
      if (payload.email === null) {
        this.errors.push('Email required')
      }
      if (payload.party_size < 1) {
        this.errors.push('Party size should between 1 and ' + this.maxPartySize)
      }

      if (this.errors.length > 0) {
        this.showError = true
        return
      }
      this.showError = false
      this.$store.dispatch('createReservation', payload).then(() => {
        this.resInstance = {
          start_time: null,
          name: null,
          email: null,
          party_size: 0
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.res-wrap {
  display: block;
  width: 300px;
  text-align: left;
  margin: 0 auto;
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  padding: 5px;

  label {
    display: inline-block;
    width: 90px;
    margin: 6px;
    font-weight: bold;
    font-size: 11pt;
  }
}
.errors {
  border: 1px solid darkred;
  background: white;
  display: block;
  width: 250px;
  text-align: left;
  margin: 8px;
  margin-right: auto;
  margin-left: auto;
  clear: both;
  font-size: 10pt;

  li {
  }
}
</style>
