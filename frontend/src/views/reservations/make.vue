<template>
  <div>
    <h3>Make a reservation</h3>
    <div>
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
      maxPartySize: 8
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

<style scoped></style>
