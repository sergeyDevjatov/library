<template>
    <div class="modal fade" :id="id" ref="modal" tabindex="-1" role="dialog" aria-labelledby="sign-up_modal-title" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="sign-up_modal-title">Зарегистрироваться</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="login">Логин</label>
                            <input type="text" v-model="login" id="login" placeholder="логин" name="login"
                                   v-validate="'required'" :class="{'form-control': true, 'is-invalid': signUpError || errors.has('login')}">
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" v-validate="'required|confirmed:password-confirm'" name="password"
                                   :class="{'form-control': true, 'is-invalid': signUpError || errors.has('password')}"
                                   v-model="password" id="password" placeholder="пароль">
                        </div>
                        <div class="form-group">
                            <label for="password-confirm">Пароль (подтверждение)</label>
                            <input type="password" id="password-confirm" name="password-confirm"
                                   :class="{'form-control': true, 'is-invalid': signUpError || errors.has('password') || errors.has('password-confirm')}"
                                   v-validate="'required'" placeholder="пароль (подтверждение)">
                            <div v-if="errors.has('password')" class="invalid-feedback">Пароли не совпадают</div>
                        </div>
                        <div v-if="signUpError" class="alert alert-danger" role="alert">
                            {{signUpErrorMsg ? signUpErrorMsg : "Не удалось зарегистрировать нового пользователя"}}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-primary"
                            @click="signUp" :disabled="!login || !password || errors.any()">Зарегистрироваться</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io';

    export default {
        props: {
            id: {}
        },
        data() {
            return {
                login: null,
                password: null,
                signUpError: false,
                signUpErrorMsg: null
            }
        },
        computed: {
            ...Vuex.mapState(['sid', 'username', 'gotSession', 'socket'])
        },
        created(){
            this.connect();
        },
        methods: {
            ...Vuex.mapMutations({
                socketOn: 'addSocketHandler',
                socketEmit: 'emitSocketEvent'
            }),
            connect(){
                this.socketOn({
                    event: 'auth.sign_up-success',
                    callback: _.bind(function (data) {
                        this.error = false;
                        this.$emit('signUp', {
                            login: this.login,
                            sid: data.sid
                        });
                        this.login = this.password = this.password_confirm = null;
                        $(this.$refs.modal).modal('hide');
                    }, this)
                });

                this.socketOn({
                    event: 'auth.sign_up-fail',
                    callback: _.bind(function (err) {
                        if (err === 'AlreadyExists') {
                            this.signUpError = true;
                            this.signUpErrorMsg = 'Пользователь с таким логином уже существует';
                        }
                    }, this)
                });
            },
            signUp: function (){
                this.socketEmit({
                    event: 'auth.sign_up',
                    data: {
                        login: this.login,
                        password: this.password
                    }
                });
            },
        }
    };
</script>