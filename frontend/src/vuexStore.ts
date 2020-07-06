import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const vuexStore = new Vuex.Store({
  state: {
    inventory: [],
      availableReservations: []
  },
  getters: {
    getCurrentInventory: state => {
      return state.inventory
    }
  },
  mutations: {
    invalidateInventoryState(state) {
      state.inventory = []
    },
    setInventory(state, data) {
      state.inventory = data
    },
    addInventory(state, data) {
      state.inventory.push(data)
      state.inventory.sort((a, b) => (a.start_time > b.start_time) ? 1 : -1)
    },
    deleteInventory(state, data) {
      //newArr = arr.filter((x) => x != a)
      state.inventory = state.inventory.filter(row => {
        return row.inventory_id != data
      })
    }
  },
  actions: {
    getInventoryForDay({commit, state}, payload) {
      // check current state
      return new Promise((resolve, reject) => {
        // Do something here... lets say, a http call using vue-resource
        if (state.inventory.length > 0) {
          resolve(state.inventory)
          return;
        }
        axios.get("http://localhost:9090/inventory/" + payload.day).then(response => {

          commit('setInventory', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    getAvailabilityForDay({commit, state}, payload) {
      // check current state
      return new Promise((resolve, reject) => {
        if (state.inventory.length > 0) {
          resolve(state.inventory)
          return;
        }
        axios.get("http://localhost:9090/inventory/" + payload.day + "/availability").then(response => {

          commit('setInventory', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    deleteInventory({commit, state }, payload) {
      return new Promise((resolve, reject) => {
        axios.delete("http://localhost:9090/inventory/" + payload).then(response => {
          commit('deleteInventory', payload)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    createInventory({commit, state}, payload) {
      console.log(payload)
      payload.date = '2020-07-15'
      payload.restaurant_id = 3
      if (payload.start_time.length < 5) {
        payload.start_time = "0" + payload.start_time
      }
      if (payload.end_time.length < 5) {
        payload.end_time = "0" + payload.end_time
      }

      return new Promise((resolve, reject) => {
        axios.post("http://localhost:9090/inventory", payload).then(response => {
          commit('addInventory', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
  }
})
export default vuexStore
