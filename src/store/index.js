import Vue from 'vue'
import Vuex from 'vuex'
import {setItem,getItem} from '@/api/storage'
Vue.use(Vuex)

const KEY_TOKEN = 'user_zj'
export default new Vuex.Store({
  state: {
    user:getItem(KEY_TOKEN)
    // user:JSON.parse(window.localStorage.getItem(KEY_TOKEN))
  },
  mutations: {
    setUser(state,data){

       state.user = data
       setItem(KEY_TOKEN,state.user)
      // window.localStorage.setItem(KEY_TOKEN,JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
