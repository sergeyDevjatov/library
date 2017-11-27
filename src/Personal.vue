<template>
    <div id="personal" v-if="username">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        computed: {
            ...Vuex.mapState(['username', 'socket'])
        },
        metaInfo: {
            title: 'Личный кабинет',
        },
    }
</script>