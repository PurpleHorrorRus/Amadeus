<template>
    <div class="chat-page-messages-list-chunk">
        <Component
            :is="MessageComponent(message)"
            v-for="(message, index) of visibleMessages"
            :key="message.id + message.text"
            :message="message"
            :last="index === chunk.length - 1"
            @click.left.native="select(message)"
            @click.right.native="$parent.openMenu(message, $event, true)"
        />
    </div>
</template>

<script>
import Message from "~/components/Messages/Message";
import System from "~/components/Messages/System";

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
            message.selected = !message.selected;
            return true;
        }
    }
};
</script>

<style lang="scss">
.chat-page-messages-list-chunk {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}
</style>