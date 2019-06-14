import Vue from 'vue'
import VueAxios from "vue-axios";
// Lib imports
import axios from 'axios'

export const HTTP = axios.create({
    baseURL: "https://voterf.ml/back",
    // baseURL: "http://localhost:8090/",
    headers: {
        "Content-Type": "application/json"
    }
});

HTTP.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
