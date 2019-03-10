<template>
    <div>
        <label>
            <slot>{{label}}</slot>
            <input :class="{hidden,hidden}" type="file"
                :accept="accept" :disabled="disabled"
            />
        </label>
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        id: {
            default: '',
        },
        label: {
            type: String,
            default: '选择本地文件',
        },
        hidden: {
            default: true,
        },
        accept: {
            default: 'image/*',
        },
        disabled: {
            default: false,
        },
    },

    data() {
        return {

        };
    },

};
</script>

<style lang="scss" spcoed>
</style>
