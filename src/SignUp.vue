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
                            <input type="text" class="form-control" v-model="login" id="login" placeholder="логин">
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" v-validate="'confirmed:password-confirm'" name="password"
                                   class="form-control" v-model="password" id="password" placeholder="пароль">
                        </div>
                        <div :class="{'form-group': true, 'has-danger': errors.has('password')}">
                            <label for="password-confirm">Пароль (подтверждение)</label>
                            <input type="password" id="password-confirm" name="password-confirm"
                                   :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                                   placeholder="пароль (подтверждение)">
                            <div v-if="errors.has('password')" class="invalid-feedback">Пароли не совпадают</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-primary" v-on:click="sign_up">Зарегистрироваться</button>
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
                sid: null,
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
            sign_up: function (){
                this.socket.emit('auth.sign_up', {login: this.login, password: this.password});

                this.socket.on('auth.sign_up-success', _.bind(function (data) {
                    this.$emit('signed_up', {login: this.login, sid: data.sid});
                    $(this.$refs.modal).modal('hide');
                }, this));

                this.socket.on('auth.sign_up-fail', _.bind(function () {
                    // TODO: if sign-up failed
                }, this));
            },
        }
    };
</script>