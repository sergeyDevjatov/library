<template>
    <div id="auth">
        <form v-if="!authorized" v-on:submit.prevent="sign_in" id="auth_form" class="form-inline">
            <div class="form-group">
                <label for="auth_login" class="sr-only">Логин</label>
                <input type="text" class="form-control" id="auth_login" name="login" placeholder="логин" v-model="login">
            </div>
            <div class="form-group mx-sm-3">
                <label for="auth_pass" class="sr-only">Пароль</label>
                <input type="password" class="form-control" id="auth_pass" name="pass" placeholder="пароль" v-model="password">
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
            <a href="#" data-toggle="modal" data-target="#sign-up_modal">Зарегистрироваться</a>
        </form>
        <div class="row" v-else id="welcome">
            <div class="col">
                <router-link class="link text-light" to="/personal">
                    Добро пожаловать, {{login}}
                </router-link>
            </div>
            <div class="col col-md-auto">
                <button class="btn btn-primary btn-sm" @click="sign_out">Выйти</button>
            </div>
        </div>
        <SignUp id="sign-up_modal" @signed_up="login=$event.login; authorized = true; sid = $event.sid"/>
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
                authorized: false,
                sid: null,
                show_signup: false,
                socket: io()
            }
        },
        beforeRouteEnter (to, from, next) {
            let vm = this;
            next(function(vm){
            });
        },
        beforeRouteUpdate (to, from, next) {
            let vm = this;
            next();
        },
        methods: {
            sign_in: function (){
                this.socket.emit('auth.sign_in', {login: this.login, password: this.password});

                this.socket.on('auth.sign_in-success', _.bind(function (data) {
                    this.authorized = true;
                    this.sid = data.sid;
                }, this));

                this.socket.on('auth.sign_in-fail', _.bind(function () {
                    this.authorized = false;
                }, this));
            },
            sign_out: function (){
                this.socket.emit('auth.sign_out', {sid: this.sid});

                this.socket.on('auth.sign_out-success', _.bind(function (data) {
                    this.sid = null;
                    this.authorized = false;
                }, this));

                this.socket.on('auth.sign_out-fail', _.bind(function () {
                    // not implemented
                }, this));
            }
        }
    };
</script>