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
    export default {
        components: {

        },
        data(){
            return {
                authors: null
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
                    event: 'authors.getAll-success',
                    callback: _.bind(function (data) {
                        this.authors = data;
                    }, this)
                });

                this.getAuthors();
            },
            getAuthors(){
                this.socketEmit({
                    event: 'authors.getAll'
                });
            }
        }
    }
</script>