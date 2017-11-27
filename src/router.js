import VueRouter from 'vue-router';
import Auth from "./Auth.vue";
import Main from "./Main.vue";
import Books from "./Books.vue";
import Authors from "./Authors.vue";
import Genres from "./Genres.vue";
import Personal from "./Personal.vue";
import PersonalOrders from "./PersonalOrders.vue";
import PersonalProfile from "./PersonalProfile.vue";

export default new VueRouter({
    linkActiveClass: 'active',
    mode: 'history',
    routes: [
        { path: '/',
            components: {
                auth: Auth,
                page: Main
            },
            meta: {title: 'Библиотека'}
        },
        {
            path: '/books',
            components: {
                auth: Auth,
                page: Books
            },
        },
        {
            path: '/authors',
            components: {
                auth: Auth,
                page: Authors
            },
        },
        {
            path: '/genres',
            components: {
                auth: Auth,
                page: Genres
            },
        },
        {
            path: '/personal',
            components: {
                auth: Auth,
                page: Personal
            },
            children: [
                {
                    path: '',
                    component:  PersonalOrders,
                },
                {
                    path: 'profile',
                    component: PersonalProfile,
                }
            ]
        },
    ]
});