<template>
  <div class="edit-block block-wrapper">
    <span class="block-title">
      <label
        >From <input type="text" name="start_time" v-model="item.start_time"
      /></label>
      <label>
        to <input type="text" name="end_time" v-model="item.end_time"/></label
    ></span>
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
      showError: false
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
      console.log(this.errors)
      if (this.errors.length > 0) {
        this.showError = true
        return
      }
      this.showError = false

      this.$emit('submitClicked', this.item)
    },
    onCancelClicked: function() {
      this.$emit('editCancelled', this.inventoryItem.inventory_id)
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
