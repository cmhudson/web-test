<template>
  <div>
    Inventory for day 2020-07-15

    <ul class="inventory-blocks">
      <li v-for="item in inventoryState" v-bind:key="item.inventory_id">
        <inventory-single-block
          v-on:editClicked="editEmitted"
          v-on:deleteClicked="deleteClicked"
          :inventory-item="item"
          v-if="editing !== item.inventory_id"
        />
        <inventory-edit-block
          :inventory-item="item"
          v-else
          v-on:submitClicked="updateClicked"
          v-on:editCancelled="editCancelled"
        />
      </li>
      <li v-if="adding === false">
        <button type="button" v-on:click="showAddForm">add</button>
      </li>
      <li v-if="adding">
        <inventory-edit-block
          :inventory-item="{}"
          v-on:submitClicked="handleCreate"
          v-on:editCancelled="adding = false"
          :create="true"
        ></inventory-edit-block>
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
      adding: false,
      rowPlaceholder: {}
    }
  },
  computed: {
    inventoryState: function() {
      return this.$store.state.inventory
    }
  },
  methods: {
    editEmitted: function(payload) {
      if (this.editing !== null) {
        return
      }
      this.editing = payload
    },
    deleteClicked: function(id) {
      this.$store.dispatch('deleteInventory', id)
    },
    editCancelled: function() {
      this.editing = null
    },
    showAddForm: function() {
      this.adding = true
    },
    handleCreate: function(payload) {
      this.$store.dispatch('createInventory', payload).then(() => {
        this.adding = false
      })
    },
    updateClicked: function(payload) {
      this.$store.dispatch('updateInventory', payload).then(() => {
        this.editing = null
      })
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
