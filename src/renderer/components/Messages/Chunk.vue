<template>
    <div class="chat-page-messages-list-chunk">
        <Component
            :is="MessageComponent(message)"
            v-for="(message, index) of visibleMessages"
            :key="message.id + message.text"
            :message="message"
            :first="index === 0"
            :last="index === visibleMessages.length - 1"
            @click.left.native="select(message)"
            @click.right.native="openMenu($event, message)"
        />
    </div>
</template>

<script lang="ts">
import Message from "~/components/Messages/Message.vue";
import System from "~/components/Messages/System.vue";

export default {
    props: {
        chunk: {
            type: Array,
            required: true
        }
    },

    computed: {
        visibleMessages() {
            return this.chunk.filter(message => {
                return !message.deleted;
            });
        }
    },

    methods: {
        MessageComponent(message) {
            return !("action" in message)
                ? Message
                : System;
        },

        select(message) {
            if ("action" in message) {
                return false;
            }

            message.selected = !message.selected;
            return true;
        },

        openMenu(event, message) {
            if ("action" in message) return false;
            this.$parent.openMenu(event, message);
        }
    }
};
</script>

<style lang="scss">
.chat-page-messages-list-chunk {
    display: flex;
    flex-direction: column-reverse;
    row-gap: 10px;
}
</style>