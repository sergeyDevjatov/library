<template>
    <div>
        <div class="text-center" id="books">
            <table class="table table-striped table-bordered table-hover">
                <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>Жанр</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="books" v-for="(book, index) in books">
                    <td>{{index + 1}}</td>
                    <td>{{book.title}}</td>
                    <td>
                        <router-link class="link" :to="{path: '/books/' + book.author.id}">
                            {{book.author.name}}
                        </router-link>
                    </td>
                    <td>
                        <router-link class="link" :to="{path: '/genres/' + book.genre.id}">
                            {{book.genre.name}}
                        </router-link>
                    </td>
                    <td>
                        <template v-if="book.isOrder" >
                            <span v-if="book.orderByUser" class="text-warning">Вы уже заказали эту книгу</span>
                            <span v-else class="text-danger">Кто-то уже заказал эту книгу</span>
                        </template>
                        <a v-else class="text-success" href="#"
                           @click="orderBookId = book.id"
                           data-toggle="modal" data-target="#bookOrder">Заказать·</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <Modal id="bookOrder" title="Заказать книгу" @accept="bookOrderAccept"
               :success.sync="lastOrderSuccess" :error.sync="lastOrderError">
            <div class="form-group row">
                <label for="returningDate" class="col-sm-5 col-form-label" >Дата возвращения</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="returningDate" placeholder="YYYY-MM-DD">
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Modal from './Modal.vue';

    export default {
        components: {
            Modal
        },
        data(){
            return {
                books: null,
                orderBookId: null,
                returningDate: null,
                lastOrderSuccess: false,
                lastOrderError: null
            };
        },
        computed: {
            ...Vuex.mapState(['sid', 'username', 'gotSession', 'socket'])
        },
        metaInfo: {
            title: 'Книги',
        },
        mounted: function () {
            let vm = this;
            this.$nextTick(function () {
                $(function () {
                    $('#returningDate').datepicker({format: 'yyyy-mm-dd'}).on(
                        "changeDate", () => { vm.returningDate = $('#returningDate').val()}
                    );
                });
            });
        },
        watch: {
            username(){
                this.getBooks();
            }
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
                    event: 'books.getAll-success',
                    callback: _.bind(function (data) {
                        this.books = data;
                    }, this)
                });

                this.socketOn({
                    event: 'orders.add-success',
                    callback: _.bind(function (data) {
                        this.lastOrderSuccess = true;
                    }, this)
                });

                this.socketOn({
                    event: 'orders.add-fail',
                    callback:_.bind(function (error) {
                        if(error.code === 'NOAUTH')
                            this.lastOrderError = 'Вы не можете заказать книгу, поскольку вы не авторизовались.';
                    }, this)
                });

                this.getBooks();
            },
            getBooks(){
                this.socketEmit({
                    event: 'books.getAll'
                });
            },
            bookOrderAccept(event){
                this.socketEmit({
                    event: 'orders.add',
                    data: {
                        returningDate: this.returningDate,
                        bookId: this.orderBookId
                    }
                });
            }
        }
    }
</script>