<template>
    <div class="chat-page-messages-list-chunk">
        <Message
            v-for="(message, index) of chunk"
            :key="message.id + message.text"
            :message="message"
            :last="index === chunk.length - 1"
            @click.native.self="$parent.select(message)"
            @click.right.native="$parent.openMenu(message, $event, true)"
        />
    </div>
</template>

<script>
export default {
    components: {
        Message: () => import("~/components/Messages/Message")
    },

    props: {
        chunk: {
            type: Array,
            required: true
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