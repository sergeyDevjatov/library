import 'bootstrap';
import 'bootstrap-datepicker';
import './../style/index.scss';
import './../style/index.less';
import io from 'socket.io';

import router from "./router.js";

let socket = io();

socket.on('connection-fail', function onConnectionFail(){
    window.location.reload();
});

Vue.use(VeeValidate);
Vue.use(VueRouter);
Vue.use(VueMeta);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        socket,
        gotSession: false,
        sid: null,
        username: null
    },
    mutations: {
        auth (state, payload) {
            _.each(['gotSession', 'sid', 'username'], function changeStateFieldIfDefined(stateFieldName){
                state[stateFieldName] = typeof payload[stateFieldName]  !== 'undefined'
                    ? payload[stateFieldName]
                    : state[stateFieldName];
            });
        },
        addSocketHandler(state, payload){
            state.socket.on(payload.event, payload.callback);
        },
        emitSocketEvent(state, payload){
            state.socket.emit(payload.event, payload.data);
        }
    }
});

new Vue({
    router,
    store,
    mounted(){
        this.$store.commit({
            type: 'addSocketHandler',
            event: 'session',
            callback: _.bind( function (data) {
                this.$store.commit({
                    type: 'auth',
                    gotSession: true,
                    sid: data.sid,
                    username: data.sid ? data.login : null
                });
            }, this)
        });
    },
    metaInfo: {
        title: 'Информационная система библиотеки',
        titleTemplate: (titleChunk) => {
            let defaultTitle = 'Информационная система библиотеки';
            // If undefined or blank then we don't need the hyphen
            return (titleChunk && titleChunk !== defaultTitle) ? `${titleChunk} | Информационная система библиотеки` : defaultTitle;
        }
    },
    el: '#app'
});