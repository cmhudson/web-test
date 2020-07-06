<template>
  <div>
    Inventory for day 2020-07-15

    <ul class="inventory-blocks">
      <li v-for="item in inventory" v-bind:key="item.inventory_id">
        <inventory-single-block
          v-on:editClicked="editEmitted"
          :inventory-item="item"
          v-if="editing !== item.inventory_id"
        />
        <inventory-edit-block
          :inventory-item="item"
          v-else
          v-on:editCancelled="editCancelled"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import InventorySingleBlock from './singleBlock'
import InventoryEditBlock from './editBlock'
export default {
  name: 'inventoryBlocks',
  components: { InventorySingleBlock, InventoryEditBlock },
  props: {
    inventory: [Array]
  },
  data: function() {
    return {
      editing: null,
      rowPlaceholder: {}
    }
  },
  methods: {
    editEmitted: function (payload) {
      if (this.editing !== null) {
        return
      }
      // get edited row, save as placeholder
      for(const item in this.inventory) {
        if (item.inventory_id === payload) {
          this.rowPlaceholder = {
            startTime: item.start_time,
            endTime: item.end_time,
            spots: item.reservation_spaces
          }
          break
        }
      }
      this.editing = payload
    },
    editCancelled: function (payload) {
      this.editing = null
      let i = 0
      for (const item in this.inventory) {
        if (payload === item.inventory_id) {
          this.inventory[i].end_time = this.rowPlaceholder.endTime
          this.inventory[i].start_time = this.rowPlaceholder.startTime
          this.inventory[i].reservation_spaces = this.rowPlaceholder.spots
        }
        this.rowPlaceholder = {}
        i++
      }
    }
  }
}
</script>

<style scoped lang="scss">
.inventory-blocks {
  li {
    list-style: none;
    width: 300px;
    display: block;
    margin: 12px auto;
    padding: 15px;
    text-align: left;
    border: 1px solid #adadad;
    border-radius: 5px;
    background: #d3d3d3;

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
  }
}
</style>
