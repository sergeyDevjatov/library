import 'bootstrap';
import 'bootstrap-datepicker';
import './../style/index.scss';
import './../style/index.less';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import io from 'socket.io';

let socket = io();

socket.on('connection-fail', function onConnectionFail(){
    window.location.reload();
});

Vue.use(VeeValidate);
Vue.use(VueRouter);

import router from "./router.js";

new Vue({
    router,
    watch:{
        username(){
            this.$emit('authUpdate');
        }
    },
    data(){
        return {
            socket: socket,
            gotSession: false,
            sid: null,
            username: null,
            session: null
        };
    },
    mounted(){
        this.socket.on('session', _.bind( function (data) {
            this.gotSession = true;
            this.sid = data.sid;
            if(this.sid) {
                this.username = data.login;
            }
        }, this));
    },
    el: '#app'
});