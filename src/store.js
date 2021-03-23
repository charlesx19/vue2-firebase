import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    uid: 'test uid',
  },
  mutations: {
   signInUid(state, userData){
    state.uid = userData.uid;
   },
  },
})

export default store;