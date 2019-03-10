<template>
    <div :click="click">
        <img class="img-preview" :src="getSrc" :alt="getAlt"/>
    </div>
</template>

<script>
let imgPlaceholder = require('../assets/imgplaceholder.png');

export default {
    inheritAttrs: false,
    props: {
        src: {
            default: '',
        },
        alt: {
            default: '',
        },
        placeholder: {
            default: imgPlaceholder,
        },
    },
    methods: {
        click() {
            if (this.src !== imgPlaceholder) {
                this.$emit('click', this.src);
            }
        },
    },
    computed: {
        getSrc() {
            return this.src ? this.src : this.placeholder;
        },
        getAlt() {
            return this.alt ? this.alt : '预览图';
        },
    },
};
</script>

<style lang="scss">
 @import '../css/_defines.scss';
 .img-placeholder,.img-preview{
    height: $preview_ht;
    width: $preview_wd;
    margin: .625rem .625rem
 }
 .img-preview{
     @include flex;
     @include flexCenter;
 }
</style>
