<template>
  <div class="edit-block block-wrapper">
    <span class="block-title">
      <label
        >From
        <select v-model="item.start_time" v-on:change="updateEndTimeIncrements">
          <option
            v-for="time in timeIncrements"
            v-bind:key="time"
            v-bind:value="time"
          >
            {{ time }}
          </option>
        </select>
      </label>
      <label>
        to
        <select v-model="item.end_time">
          <option
            v-for="time in endTimeIncrements"
            v-bind:key="time"
            v-bind:value="time"
          >
            {{ time }}
          </option>
        </select></label
      ></span
    >
    <div class="block-detail">
      <br /><label>
        <select name="reservation_spaces" v-model="item.reservation_spaces">
          <option
            v-for="i in getNumberSpaces()"
            v-bind:key="i"
            v-bind:value="i"
            >{{ i }}</option
          >
        </select>
        reservation spots
      </label>
      <div class="errors" v-if="showError">
        <ul>
          <li v-for="(error, key) in errors" v-bind:key="key">
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
    <span class="block-tools">
      <br /><button type="submit" v-on:click="onSubmitClick">save</button>
      <button type="button" v-on:click="onCancelClicked">cancel</button>
    </span>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'inventoryEditBlock',
  props: {
    inventoryItem: Object,
    create: Boolean
  },
  data: function() {
    return {
      spaces: [],
      maxSpaces: 15,
      item: {},
      errors: [],
      showError: false,
      timeIncrements: [],
      endTimeIncrements: []
    }
  },
  created() {
    if (this.create) {
      this.item = {
        start_time: null,
        end_time: null,
        reservation_spaces: null
      }
    } else {
      this.item = this.inventoryItem
    }
    this.timeIncrements = this.getTimeIncrements()
    this.endTimeIncrements = this.updateEndTimeIncrements()
  },
  methods: {
    getNumberSpaces: function() {
      const array = []
      for (let i = 0; i < this.maxSpaces; i++) {
        array.push(i)
      }
      return array
    },
    onSubmitClick: function() {
      this.errors = []
      if (this.item.start_time === null) {
        this.errors.push('Start time required')
      }
      if (this.item.end_time === null) {
        this.errors.push('End time required')
      }
      if (this.item.reservation_spaces < 1) {
        this.errors.push(
          'Reservation spots should between 1 and ' + this.maxSpaces
        )
      }
      if (this.errors.length > 0) {
        this.showError = true
        return
      }
      this.showError = false

      this.$emit('submitClicked', this.item)
    },
    onCancelClicked: function() {
      this.$emit('editCancelled', this.inventoryItem.inventory_id)
    },
    getTimeIncrements: function() {
      const timer = moment()
      timer.hour(10).minute(0)
      const endTime = moment()
        .hour(21)
        .minute(0)
      const times = []
      while (timer < endTime) {
        times.push(timer.format('HH:mm'))
        timer.add(15, 'minutes')
      }
      return times
    },
    updateEndTimeIncrements: function() {
      const currentStartTime = this.item.start_time
      console.log(currentStartTime)
      if (!currentStartTime) {
        return []
      }
      const index = this.timeIncrements.findIndex(row => {
        return currentStartTime === row
      })
      return this.timeIncrements.slice(index + 1)
    }
  }
}
</script>

<style scoped lang="scss">
.edit-block {
  input {
    width: 50px;
  }
  .errors {
    border: 1px solid darkred;
    background: white;
    display: block;
    clear: both;
    margin: 8px;

    li {
    }
  }
}
</style>
