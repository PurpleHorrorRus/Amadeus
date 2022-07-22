<template>
    <div id="message-page-input-field-send" @click="send">
        <SendIcon 
            v-if="!loading"
            id="message-page-input-field-send-icon" 
            class="icon"
            :class="sendIconClass"
        />

        <LoaderIcon
            v-else
            id="message-page-input-loader-icon"
            class="icon loader-icon spin"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        SendIcon: () => import("~icons/send.svg")
    },

    props: {
        loading: {
            type: Boolean,
            required: false,
            default: false
        },

        canSend: {
            type: Boolean,
            requried: false,
            default: false
        }
    },

    computed: {
        sendIconClass() {
            return {
                disabled: !this.canSend
            };
        }
    },

    methods: {
        send() {
            return this.$emit("send");
        }
    }
};
</script>

<style lang="scss">
#message-page-input-field-send {
    display: flex;
    justify-content: center;

    width: 23px;
    height: 100%;
            
    cursor: pointer;

    &.disabled {
        cursor: not-allowed;
    }

    &-icon {
        width: 100%;

        path {
            stroke: none;
            fill: var(--secondary);
        }
    }
}
</style>