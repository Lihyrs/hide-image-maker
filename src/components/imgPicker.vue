<template>
<div class="img-picker">

        <el-input v-model="url"  :disabled="disabled"
            placeholder="输入图片地址" type="url" class="url-picker"
            @change="loadFromHttp($event)" :accept="accept"
        ></el-input>

         <localfileinput class="local-picker" :disabled="disabled"
            @change.native.stop="loadFromLocal($event)">
            <slot></slot>
        </localfileinput>
</div>
</template>

<script>
import Vue from 'vue';
import { Input } from 'element-ui';
// import imgUrlInput from './imgUrlInput.vue';
import localFileInput from './localFileInput.vue';
import imageLoader from '../utils/imageLoader';

Vue.use(Input);

export default {
    components: {
        localfileinput: localFileInput,
    },
    props: {
        disabled: {
            default: false,
        },
        accept: {
            default: 'image/*',
        },
    },
    data() {
        return {
            url: '',
            path: '',
            base64: '',
        };
    },
    methods: {
        change(evt) {
            this.$emit('onPick', evt);
        },
        loadFromHttp(url) {
            // const url = evt.target.value;
            // console.log('loadHttp==>', url);
            imageLoader.http(url).then((b64) => {
                this.base64 = b64;
                this.$emit('onPick', this.base64);
            }).catch((e) => {
                // console.log('http==>', e);
                this.$emit('onError', e);
            });
        },
        loadFromLocal(evt) {
            // console.log('loadLocal==>', evt);
            const files = evt.target.files;
            imageLoader.local(files[0]).then((b64) => {
                this.base64 = b64;
                this.$emit('onPick', this.base64);
            }).catch((e) => {
                this.$emit('onError', e);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../css/_defines.scss';
.img-picker{
    @include flexCenter;
    @include flexRow;
    align-content: center;
    justify-content: center;
    align-self: stretch;
    >*{
        margin-top: .3125rem;
        margin-bottom: .3125rem
    }
}
</style>
