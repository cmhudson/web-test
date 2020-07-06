<template>
  <div>
    <h1>Reservations</h1>
    <reservations-make :availability="availabilityData" />
  </div>
</template>

<script>

import ReservationsMake from "@/views/reservations/make";
export default {
  name: 'Reservations',
  components: {ReservationsMake},
  data: function() {
    return {
      availabilityData: []
    }
  },
  computed: {
    availability: function () {
      return this.$store.getters.getFilteredAvailability
    }
  },
  async mounted() {
    const payload = {
      day: '2020-07-15'
    }

    const store = this.$store
    this.$store.dispatch('getAvailabilityForDay', payload).then(() => {
      this.setAvailabilityData(store.getters.getFilteredAvailability)
    })
  },
  methods: {
    setAvailabilityData: function (data) {
      this.availabilityData = data
    }
  }
}
</script>
