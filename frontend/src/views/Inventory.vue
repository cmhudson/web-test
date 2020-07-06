<template>
  <div>
    <h1>Inventory for 2020-07-15</h1>
    <inventory-blocks :inventory="inventoryData"></inventory-blocks>
  </div>
</template>

<script>
import InventoryBlocks from "./inventory/blocks";
export default {
  name: 'Inventory',
  components: {InventoryBlocks},
  data: function() {
    return {
      inventoryData: []
    }
  },
  created: function() {
    console.log('created')
    const payload = {
      day: '2020-07-15'
    }
    const store = this.$store
    this.$store.dispatch('getInventoryForDay', payload).then(() => {
      this.setInventoryData(store.getters.getCurrentInventory)
    })
  },
  methods: {
    setInventoryData: function (data) {
      console.log("in the method", data)
      this.inventoryData = data
    }
  }
}
</script>
