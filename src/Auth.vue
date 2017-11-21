<template>
    <div id="auth" v-show="gotSession">
        <form v-if="!username" v-on:submit.prevent="sign_in" id="auth_form" class="form-inline">
            <div class="form-group">
                <label for="auth_login" class="sr-only">Логин</label>
                <input type="text" id="auth_login" name="login" placeholder="логин" v-model="login"
                       :class="{'form-control': true, 'is-invalid': signInError}">
            </div>
            <div class="form-group mx-sm-3">
                <label for="auth_pass" class="sr-only">Пароль</label>
                <input type="password" id="auth_pass" name="pass" placeholder="пароль" v-model="password"
                       :class="{'form-control': true, 'is-invalid': signInError}">
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
            <a href="#" data-toggle="modal" data-target="#sign-up_modal">Зарегистрироваться</a>
        </form>
        <div class="row" v-else id="welcome">
            <div class="col">
                <router-link class="link text-light" to="/personal">
                    Добро пожаловать, {{username}}
                </router-link>
            </div>
            <div class="col col-md-auto">
                <button class="btn btn-primary btn-sm" @click="sign_out">Выйти</button>
            </div>
        </div>
        <SignUp id="sign-up_modal" @signed_up="username=$event.login; sid = $event.sid"/>
    </div>
</template>

<script>
    import io from 'socket.io';
    import SignUp from './SignUp.vue';

    export default {
        components: {
            SignUp
        },
        data() {
            return {
                login: null,
                password: null,
                username: null,
                sid: null,
                showSignup: false,
                socket: null,
                signInError: false,
                gotSession: false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(function(vm){
                vm.connect();
            });
        },
        beforeRouteUpdate (to, from, next) {
            this.connect();
            next();
        },
        methods: {
            connect: function(){
                this.socket = io();
                this.socket.on('session', _.bind( function (data) {
                    this.gotSession = true;
                    this.sid = data.sid;
                    if(this.sid) {
                        this.username = data.login;
                    }
                }, this));

                this.socket.on('auth.sign_in-success', _.bind(function (data) {
                    this.username = this.login;
                    this.login = this.password = null;
                    this.sid = data.sid;
                    this.signInError = false;
                    console.log(this.username);
                }, this));

                this.socket.on('auth.sign_in-fail', _.bind(function () {
                    this.username = null;
                    this.signInError = true;
                }, this));

                this.socket.on('auth.sign_out-success', _.bind(function () {
                    this.sid = this.username = null;
                }, this));
            },
            sign_in: function (){
                this.socket.emit('auth.sign_in', {login: this.login, password: this.password});
            },
            sign_out: function (){
                this.socket.emit('auth.sign_out');
            }
        }
    };
</script>