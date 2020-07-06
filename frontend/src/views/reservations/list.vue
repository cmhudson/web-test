<template>
  <div>
    <h3>Available slots for 2020-07-15</h3>
    <div class="list-wrap">
      <div class="list-item" v-for="item in times" v-bind:key="item.start_time">
        {{ item.start_time }}<br />
        spaces remaining: {{ item.available_reservations }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reservationsList',
  props: {
    times: Array
  }
}
</script>

<style scoped lang="scss">
.list-wrap {
  display: block;
  width: 300px;
  height: 400px;
  overflow: auto;
  margin: 0 auto;
}
.list-item {
  border-top: 1px dotted darkgray;
  padding: 10px;
  text-align: left;
  font-size: 12pt;
}
</style>
