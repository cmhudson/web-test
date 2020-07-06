<template>
    <div class="edit-block block-wrapper">
        <span class="block-title">
            <label>From <input type="text" name="start_time" v-model="inventoryItem.start_time" /></label>
            <label>to <input type="text" name="end_time" v-model="inventoryItem.end_time"></label></span>
        <span class="block-detail">
            <br /><label>
                <select name="reservation_spaces" v-model="inventoryItem.reservation_spaces">
                <option v-for="i in getNumberSpaces()" v-bind:key="i" v-bind:value="i">{{ i }}</option>
            </select> reservation spots
            </label>
        </span>
        <span class="block-tools">
      <br /><button type="submit" v-on:click="onSubmitClick">save</button>
            <button type="button" v-on:click="onCancelClicked">cancel</button>
    </span>
    </div>
</template>

<script>
  export default {
    name: "inventoryEditBlock",
    props: {
      inventoryItem: Object
    },
    data: function () {
        return {
          spaces: [],
          maxSpaces: 15
        }
    },
    methods: {
      getNumberSpaces: function () {
        const array = []
        for (let i =0; i < this.maxSpaces; i ++) {
          array.push(i)
        }
        return array
      },
      onSubmitClick: function () {
        this.$emit('submit-clicked', this.inventoryItem)
      },
      onCancelClicked: function () {
        this.$emit('editCancelled', this.inventoryItem.inventory_id)
      }
    }
  }
</script>

<style scoped>

</style>
