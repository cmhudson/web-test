import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const vuexStore = new Vuex.Store({
  state: {
    inventory: []
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
    }
  },
  actions: {
    getInventoryForDay({ commit, state }, payload) {
      // check current state
      return new Promise((resolve, reject) => {
        // Do something here... lets say, a http call using vue-resource
        if (state.inventory.length > 0) {
          resolve(state.inventory)
          return;
        }
        axios.get("http://localhost:9090/inventory/" + payload.day + "/times").then(response => {
          // http success, call the mutator and change something in state
          commit('setInventory', response.data)
            resolve(true)
        }, error => {
          reject(error);
        })
      })
    }
  }
});
export default vuexStore
