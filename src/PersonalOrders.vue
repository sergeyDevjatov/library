<template>
    <div id="orders">
        <h3>Заказы</h3>
        <div class="text-center table-responsive table-bordered table-hover">
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Заказана</th>
                    <th>Вернуть до</th>
                    <th>Наименование</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(order, index) in orders">
                    <td>{{index + 1}}</td>
                    <td>{{order.receivingDate}}</td>
                    <td>{{order.returningDate}}</td>
                    <td>
                        <router-link v-if="order.book" class="link" :to="{path: '/books/' + order.book.id}">
                            {{order.book.title}}
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                orders: null
            }
        },
        computed: {
            ...Vuex.mapState(['username', 'socket'])
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
                    event: 'orders.getAll-success',
                    callback: _.bind(function (data) {
                        console.log(data);
                        this.orders = data;
                    }, this)
                });

                this.getAuthors();
            },
            getAuthors(){
                this.socketEmit({
                    event: 'orders.getAll'
                });
            }
        }
    }
</script>