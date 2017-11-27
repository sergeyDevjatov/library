<template>
    <div id="genres">
        <div class="text-center table-responsive table-bordered table-hover" id="books">
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Название</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(genre, index) in genres">
                    <td>{{index + 1}}</td>
                    <td>{{genre.name}}</td>
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
                genres: null
            }
        },
        created(){
            this.connect();
        },
        metaInfo: {
            title: 'Жанры',
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
                    event: 'genres.getAll-success',
                    callback: _.bind(function (data) {
                        this.genres = data;
                    }, this)
                });

                this.getAuthors();
            },
            getAuthors(){
                this.socketEmit({
                    event: 'genres.getAll'
                });
            }
        }
    }
</script>