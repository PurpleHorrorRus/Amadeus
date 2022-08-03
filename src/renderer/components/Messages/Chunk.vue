<template>
    <div class="chat-page-messages-list-chunk">
        <Message
            v-if="!message.action"
            :message="message"
            @click.left.native="select($event, message)"
            @click.right.native="openMenu($event, message)"
        />

        <System v-else :message="message" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        Message: () => import("~/components/Messages/Message.vue"),
        System: () => import("~/components/Messages/System.vue")
    },

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    methods: {
        select(event, message) {
            if ("action" in message) {
                return false;
            }

            if (window.getSelection().toString().length > 0) {
                const element = window.getSelection()
                    .getRangeAt(0)
                    .startContainer.parentNode;

                return element !== event.target
                    ? window.getSelection().empty()
                    : false;
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