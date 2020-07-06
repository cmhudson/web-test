import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const vuexStore = new Vuex.Store({
  state: {
    inventory: [],
    availableReservations: [],
    reservations: []
  },
  getters: {
    getCurrentInventory: state => {
      return state.inventory
    },
    getFilteredAvailability: state => {
      return state.availableReservations.filter(row => {
        return row.available_reservations > 0
      })
    }
  },
  mutations: {
    invalidateInventoryState(state) {
      state.inventory = []
    },
    setAvailability(state, data) {
      state.availableReservations = data
    },
    setInventory(state, data) {
      state.inventory = data
    },
    setReservations(state, data) {
      state.reservations = data
    },
    addReservation(state, data) {
      state.reservations.push(data)
      state.reservations.sort((a, b) => (a.start_time > b.start_time) ? 1 : -1)
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
    },
    updateInventoryItem(state, data) {
      state.inventory.forEach(row => {
        if (row.inventory_id == data.inventory_id) {
          row = data
        }
      })
    }
  },
  actions: {
    getReservationsForDay({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        /*if (state.inventory.length > 0) {
          resolve(state.inventory)
          return;
        }*/
        axios.get("http://localhost:9090/reservations/" + payload.day).then(response => {

          commit('setReservations', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    createReservation({ commit, state }, payload) {
      const item = {
        start_time: payload.start_time,
        date: "2020-07-15",
        name: payload.name,
        email: payload.email,
        party_size: payload.party_size,
        restaurant_id: 3
      }
      return new Promise((resolve, reject) => {
        axios.post("http://localhost:9090/reservations", item).then(response => {
          commit('addReservation', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
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

          commit('setAvailability', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    deleteInventory({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        axios.delete("http://localhost:9090/inventory/" + payload).then(response => {
          commit('deleteInventory', payload)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    updateInventory({commit, state}, payload) {
      const item = {
        start_time: payload.start_time,
        end_time: payload.end_time,
        date: '2020-07-15'
      }
      if (item.start_time.length < 5) {
        item.start_time = "0" + item.start_time
      }
      if (item.end_time.length < 5) {
        item.end_time = "0" + item.end_time
      }
      const itemId = payload.inventory_id
      return new Promise((resolve, reject) => {
        axios.put("http://localhost:9090/inventory/" + itemId, item).then(response => {
          commit('updateInventoryItem', response.data)
          resolve(true)
        }, error => {
          reject(error);
        })
      })
    },
    createInventory({commit, state}, payload) {
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
