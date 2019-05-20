import Vue from 'vue'
import VueAxios from "vue-axios";
// Lib imports
import axios from 'axios'

export const HTTP = axios.create({
    baseURL: "http://134.209.237.111:8090/",
    // baseURL: "http://localhost:8090/",
    headers: {
        "Content-Type": "application/json"
    }
});

HTTP.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
