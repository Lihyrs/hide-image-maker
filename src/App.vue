<template>
  <div id="app">
    <mainview></mainview>
  </div>
</template>

<script>
import mainView from './components/mainView.vue';

export default {
    name: 'app',
    components: {
        mainview: mainView,
    },
};
</script>

<style lang="scss">
@import './css/base.scss';
</style>
