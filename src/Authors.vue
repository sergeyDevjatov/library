<template>
    <div id="authors">
     <div class="text-center table-responsive table-bordered table-hover" id="books">
         <table class="table table-striped">
           <thead class="thead-dark">
             <tr>
               <th>#</th>
               <th>Имя</th>
               <th>Родился</th>
               <th>Умер</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="(author, index) in authors">
               <td>{{index + 1}}</td>
               <td>{{author.name}}</td>
               <td>{{author.born}}</td>
               <td>{{author.dead ? author.dead : "-"}}</td>
             </tr>
           </tbody>
         </table>
     </div>
    </div>
</template>

<script>
    import io from 'socket.io';

    export default {
        components: {

        },
        data(){
            return {
                authors: null
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
            connect(){
                this.socket = io();

                this.socket.on('authors.getAll-success', _.bind(function (data) {
                    this.authors = data;
                }, this));

                this.getAuthors();
            },
            getAuthors(){
                this.socket.emit('authors.getAll');
            }
        }
    }
</script>