<template>
  <div>
    <h1>Reservations</h1>
    <reservations-make :availability="filteredAvailability" />
    <reservations-list :times="availability" />
  </div>
</template>

<script>
import ReservationsMake from '@/views/reservations/make'
import ReservationsList from '@/views/reservations/list'
export default {
  name: 'Reservations',
  components: { ReservationsMake, ReservationsList },
  data: function() {
    return {
      filteredAvailabilityData: [],
      allAvailabilityData: []
    }
  },
  computed: {
    availability: function() {
      return this.$store.getters.getAvailability
    },
    filteredAvailability: function() {
      return this.$store.getters.getFilteredAvailability
    }
  },
  mounted: function() {
    const payload = {
      day: '2020-07-15'
    }

    this.$store.dispatch('getAvailabilityForDay', payload).then(() => {
      this.setAvailabilityData()
    })
  },
  methods: {
    setAvailabilityData: function() {
      this.filteredAvailabilityData = this.$store.getters.getFilteredAvailability
      this.allAvailabilityData = this.$store.getters.getAvailability
    }
  }
}
</script>
