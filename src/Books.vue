<template>
    <div>
        <div class="text-center table-responsive table-bordered table-hover" id="books">
            <table class="table table-striped">
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
                        <a v-if="!book.order" class="text-success" href="#"
                           @click="orderBookId = book.id"
                           data-toggle="modal" data-target="#bookOrder">Заказать·</a>
                        <p v-else>
                            <span v-if="username !== book.order.user" class="text-danger">Кто-то уже заказал эту книгу</span>
                            <span v-else class="text-warning">Вы уже заказали эту книгу</span>
                        </p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <Modal id="bookOrder" title="Заказать книгу" @accept="bookOrderAccept"
               @successOk="lastOrderSuccess = false" @errorOk="lastOrderError = null"
               :success="lastOrderSuccess" :error="lastOrderError">
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
    import io from 'socket.io';
    import Modal from './Modal.vue';

    export default {
        components: {
            Modal
        },
        props:{
            username: {type: String}
        },
        data(){
            return {
                books: null,
                orderBookId: null,
                socket: null,
                returningDate: null,
                lastOrderSuccess: false,
                lastOrderError: null
            };
        },
        mounted: function () {
            let vm = this;
            this.$nextTick(function () {
                $(function () {
                    $('#returningDate').datepicker({format: 'yyyy-mm-dd'}).on(
                        "changeDate", () => { vm.returningDate = $('#returningDate').val()}
                    );
                });
                // $('#order_success_ok_button').click(function (e) {
                //     e.preventDefault();
                //     $('#order_success_modal').modal('hide');
                //     this.$router.push('./personal');
                // });
            });
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
            connect(){
                this.socket = io();

                this.socket.on('books.getAll-success', _.bind(function (data) {
                    this.books = data;
                }, this));

                this.socket.on('orders.add-success', _.bind(function (data) {
                    this.lastOrderSuccess = true;
                }, this));

                this.socket.on('orders.add-fail', _.bind(function (error) {
                    if(error.code === 'NOAUTH')
                        this.lastOrderError = 'Вы не можете заказать книгу, поскольку вы не авторизовались.';
                }, this));

                this.getBooks();
            },
            getBooks(){
                this.socket.emit('books.getAll');
            },
            bookOrderAccept(event){
                this.socket.emit('orders.add', {returningDate: this.returningDate, bookId: this.orderBookId});
            }
        }
    }
</script>