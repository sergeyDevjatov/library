<template>
    <div id="auth" v-show="gotSession">
        <form v-if="!username" @submit.prevent="signIn" id="auth_form" class="form-inline">
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
            <div class="nam col">
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown" style="color: white"
                       href="#" role="button" aria-haspopup="true" aria-expanded="false">Добро пожаловать, {{username}}</a>
                    <div class="dropdown-menu">
                        <router-link class="dropdown-item" to="/personal" exact>Заказы</router-link>
                        <router-link class="dropdown-item" to="/personal/profile">Профиль</router-link>
                    </div>
                </div>
            </div>
            <div class="col col-md-auto d-flex">
                <button class="btn btn-primary btn-sm align-self-center" @click="signOut">Выйти</button>
            </div>
        </div>
        <SignUp id="sign-up_modal" @signUp="onSignUp"/>
    </div>
</template>

<script>
    import SignUp from './SignUp.vue';

    export default {
        components: {
            SignUp
        },
        data() {
            return {
                login: null,
                password: null,
                signInError: false,
            }
        },
        computed: {
            ...Vuex.mapState(['sid', 'username', 'gotSession', 'socket'])
        },
        created(){
            this.connect();
        },
        beforeRouteEnter (to, from, next) {
            next(function(vm){
            });
        },
        beforeRouteUpdate (to, from, next) {
            next();
        },
        methods: {
            ...Vuex.mapMutations({
                socketOn: 'addSocketHandler',
                socketEmit: 'emitSocketEvent',
                auth: 'auth'
            }),
            connect: function(){
                this.socketOn({
                    event: 'auth.sign_in-success',
                    callback: _.bind(function (data) {
                        this.auth({
                            username: this.login,
                            sid: data.sid
                        });
                        this.signInError = false;
                        this.login = this.password = null;
                    }, this)
                });

                this.socketOn({
                    event: 'auth.sign_in-fail',
                    callback: _.bind(function () {
                        this.signInError = true;
                    }, this)
                });

                this.socketOn({
                    event: 'auth.sign_out-success',
                    callback: _.bind(function () {
                        this.auth({
                            sid: null,
                            username: null
                        });
                    }, this)
                });
            },
            signIn(){
                this.socketEmit({
                    event: 'auth.sign_in',
                    data: {
                        login: this.login,
                        password: this.password
                    }
                });
            },
            signOut(){
                this.socketEmit({
                    event: 'auth.sign_out'
                });
            },
            onSignUp(event){
                this.auth({
                    username: event.login,
                    sid: event.sid
                });
            }
        }
    };
</script>