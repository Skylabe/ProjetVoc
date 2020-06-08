import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        revisionWords: null,
        responseWords: null,
        packId: null
    },
    mutations: {

    },
    actions: {
        storeWords(words){
            this.state.revisionWords = words;
        },
        cleanWords(){
            this.state.revisionWords = null;
        }
    }
});