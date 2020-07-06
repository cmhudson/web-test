<template>
  <div>
    <h1>Inventory for 2020-07-15</h1>
    <inventory-blocks :inventory="inventoryData"></inventory-blocks>
  </div>
</template>

<script>
import InventoryBlocks from './inventory/blocks'
export default {
  name: 'Inventory',
  components: { InventoryBlocks },
  data: function() {
    return {
      inventoryData: []
    }
  },
  mounted: function() {
    const payload = {
      day: '2020-07-15'
    }
    const store = this.$store
    this.$store.dispatch('getInventoryForDay', payload).then(() => {
      this.setInventoryData(store.getters.getCurrentInventory)
    })
  },
  methods: {
    setInventoryData: function(data) {
      this.inventoryData = data
    }
  }
}
</script>
