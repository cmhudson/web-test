<template>

  <div class="block-wrapper">
    <span class="block-title">From {{ inventoryItem.start_time }} to {{ inventoryItem.end_time }}</span>
    <span class="block-detail">
      {{ inventoryItem.reservation_spaces }} reservation spots
    </span>
    <span class="block-tools">
      <a href="javscript://" v-on:click="editClicked">edit</a> |
      <a href="javascript://" v-on:click="deleteClicked">delete</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'inventorySingleBlock',
  props: {
    inventoryItem: Object
  },
  methods: {
    editClicked: function () {
        this.$emit('editClicked', this.inventoryItem.inventory_id)
    },
    deleteClicked: function () {
      this.$emit('deleteClicked', this.inventoryItem.inventory_id)
    }
  }
}
</script>

<style scoped lang="scss">


  .block-title {
    font-weight: bold;
  }
  .block-detail {
    clear: both;
    display: block;
  }
  .block-tools {
    display: block;
  }
</style>
