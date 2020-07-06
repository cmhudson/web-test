<template>
  <div>
    <h1>Inventory</h1>
  </div>
</template>

<script>
export default {
  name: 'Inventory',
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
