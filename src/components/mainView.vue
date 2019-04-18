

<template>

    <div id="wrapper">
        <div id="content">
        <!-- 生成图预览 -->
        <imgpreview class="ret-preview"  :src="rb64"  @click.native.stop="showResult"
         :placeholder="require('../assets/retpreview.png')"></imgpreview>


        <div id="img-pickers">
            <div>
                <span>显示图</span>
                <!-- 图片1 -->
                <imgpicker  class="img-picker" :disabled="disabled" @onPick="pickFront($event)"
                     @onError="showErr($event)"
                >
                    <imgpreview class="preview" :src="fb64"></imgpreview>
                </imgpicker>
            </div>
            <el-button type="primary"
        :disabled="!(this.fb64 && this.bgb64)"
         @click="make">生成</el-button>
            <div>
                <span>隐藏图</span>
                <!-- 图片2，隐藏在图片1中 -->
                <imgpicker  class="img-picker" :disabled="disabled" @onPick="pickBg($event)"
                    @onError="showErr($event)"
                >
                <imgpreview class="preview" :src="bgb64"></imgpreview>
                </imgpicker>
            </div>
        </div>

        <!-- <el-button type="primary"
        :disabled="!(this.fb64 && this.bgb64)"
         @click="make">生成</el-button> -->
        </div>
        <el-dialog :visible.sync="visible" @closed="closeRetPreview" append-to-body
            close-on-click-modal title="点击图片试试效果"
        >
            <div :class="['result',bg]"
             @click.stop="changBg" >
                <img :src="rb64">
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    Button, Row, Col, Loading, Message, Dialog,
} from 'element-ui';
import Vue from 'vue';
import imgPreview from './imgPreview.vue';
import hideImgMaker from '../hideImageMaker';
import imgPicker from './imgPicker.vue';

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Loading);
Vue.use(Dialog);

export default {
    components: {
        imgpreview: imgPreview,
        imgpicker: imgPicker,
    },
    data() {
        return {
            rb64: '',
            fb64: '',
            bgb64: '',
            disabled: false,
            visible: false,
            bg: 'white',
        };
    },
    methods: {
        make() {
            if (this.fb64 && this.bgb64) {
                this.disabled = true;

                const loading = this.$loading({
                    lock: true,
                    text: '正在隐藏...',
                    background: 'rgba(0, 0, 0, 0.7)',
                });

                const msg = Message;

                const hideImgMk = new hideImgMaker();
                hideImgMk.makeHideImage(this.fb64, this.bgb64).then((b64) => {
                    this.rb64 = b64;
                    msg({
                        message: '隐藏成功', type: 'success',
                    });
                }).catch((e) => {
                    // console.log('ret==>', e);
                    msg({ message: '隐藏失败', type: 'error' });
                }).finally(() => {
                    this.disabled = false;
                    // setTimeout(() => {
                    //     loading.close();
                    // }, 10000);
                    loading.close();
                });
            }
        },
        showErr(err) {
            Message({
                message: err,
                type: 'error',
            });
        },
        showResult() {
            if (!this.rb64) {
                return;
            }
            this.visible = true;
        },
        closeRetPreview() {
            this.bg = 'white';
        },
        pickFront(evt) {
            // console.log(evt);
            if (!evt) {
                return;
            }
            this.fb64 = evt;
        },
        pickBg(evt) {
            if (!evt) {
                return;
            }
            this.bgb64 = evt;
        },
        changBg() {
            this.bg = this.bg === 'white' ? 'black' : 'white';
        },
    },
};
</script>

<style lang="scss">
@import '../css/_defines.scss';
img {
    background-size: contain;
    background-repeat: no-repeat;
}
.ret-preview{
    //width: $ret_preview_wd;
    width: percentage(3 / 5);;
    @include flexCenter;
    height: $ret_preview_ht;
    justify-content:center;
    align-content: center;
    margin: 1.875rem;
    img {
        width:auto;
        height: $ret_preview_ht;
    }
}

.result{
    width: 100%;
    @include flexColumn;
    @include flexCenter;
    img{
        width: 50%;
    }
}

.white{
    background-color: white
}

.black{
    background-color: black
}

#wrapper {
    height: 100%;
    @include flexColumn;
    @include flexCenter;
    #content {
        width: percentage(3 / 5);
         @include flexColumn;
    @include flexCenter;
    }
}

#img-pickers{
    @include flexRow;
    @include flexCenter;
    justify-content: space-between;
    margin: 1.25rem;
    width: 100%;
    >div {
        @include flexColumn;
        @include flexCenter;
        width: percentage(2 / 5);
    }
    .img-picker {
        @include flex;
        flex-direction: column-reverse !important;
        width: 100%;
        img {
            margin: .625rem
        }

    }
}
</style>
