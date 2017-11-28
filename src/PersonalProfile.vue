<template>
    <div id="profile">
        <div v-if="user">
            <h2>{{user.login}}</h2>
            <p>{{user.profile.name}} {{user.profile.lastName}}<br>
            {{user.profile.status}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                user: null
            }
        },
        computed: {
            ...Vuex.mapState(['username', 'socket'])
        },
        metaInfo: {
            title: 'Профиль | Личный кабинет',
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
                socketEmit: 'emitSocketEvent'
            }),
            connect(){
                this.socketOn({
                    event: 'users.getByLogin-success',
                    callback: _.bind(function (data) {
                        this.user = data;
                    }, this)
                });

                this.getAuthors();
            },
            getAuthors(){
                this.socketEmit({
                    event: 'users.getByLogin',
                    data: {
                        login: this.username
                    }
                });
            }
        }
    }
</script>