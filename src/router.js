import VueRouter from 'vue-router';
import Auth from "./Auth.vue";
import Main from "./Main.vue";
import Books from "./Books.vue";
import Authors from "./Authors.vue";
import Genres from "./Genres.vue";

export default new VueRouter({
    linkActiveClass: 'active',
    mode: 'history',
    routes: [
        { path: '/',
            components: {
                auth: Auth,
                page: Main
            }
        },
        {
            path: '/books',
            components: {
                auth: Auth,
                page: Books
            }
        },
        {
            path: '/authors',
            components: {
                auth: Auth,
                page: Authors
            }
        },
        {
            path: '/genres',
            components: {
                auth: Auth,
                page: Genres
            }
        },
    ]
});