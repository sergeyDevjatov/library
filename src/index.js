import 'bootstrap';
import './../style/index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import router from "./router.js";

new Vue({
    router,
    el: '#app'
});