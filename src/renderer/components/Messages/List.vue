<template>
    <div id="chat-page-messages-list">
        <MessagesChunk
            v-for="message of visibleMessages"
            :key="message.id + '_' + message.update_time + '_' + message.syncing"
            :message="message"
        />

        <ContextMenu
            v-if="menu.show"
            :menu="menu"
            :margins="[0, -70]"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/message/attachments";
import MenuMixin from "~/mixins/menu";
import DateMixin from "~/mixins/date";
import ActionsMixin from "~/mixins/message/actions";

import Message from "~/instances/Messages/Message";

export default {
    components: {
        MessagesChunk: () => import("~/components/Messages/Chunk.vue")
    },

    mixins: [CoreMixin, AttachmentsMixin, MenuMixin, DateMixin, ActionsMixin],

    props: {
        messages: {
            type: Array,
            required: true
        }
    },

    data: () => ({
        firstLoad: true,
        loadMore: false
    }),

    computed: {
        visibleMessages() {
            return this.messages.filter((message: Message) => {
                return !message.deleted;
            });
        }
    },

    methods: {
        ...mapActions({
            append: "vk/messages/APPEND"
        }),

        scrollToBottom() {
            this.$el.scrollTop = 0;
            return true;
        },

        setMenuItems(message) {
            if ("action" in this.menu.target) {
                return false;
            }

            const hours = this.dateDiff(this.menu.target).hours();

            this.menu.items = [{
                id: "reply",
                label: this.$strings.MENU.MESSAGE.REPLY,
                show: !this.current.information.restricted,
                function: () => this.action("reply", message)
            },

            {
                id: "edit",
                label: this.$strings.MENU.MESSAGE.EDIT,
                show: message.out
                    && hours < 24
                    && !this.checkBlockedAttachments(this.menu.target),

                function: () => this.action("edit", message)
            },

            {
                id: "delete",
                label: this.$strings.MENU.MESSAGE.DELETE,
                function: () => this.action("delete", message)
            },

            {
                id: "delete-for-all",
                label: this.$strings.MENU.MESSAGE.DELETE_FOR_ALL,
                show: message.out
                    && hours < 24
                    && this.current.id !== this.user.id,

                function: () => this.action("delete-for-all", message)
            }];
        }
    }
};
</script>

<style lang="scss">
#chat-page-messages-list {
    position: absolute;
    inset: 0px;

    display: flex;
    flex-direction: column-reverse;
    row-gap: 5px;

    width: 100%;
    height: 100%;

    padding: 10px;

    overflow-x: hidden;
    overflow-y: auto;

    .scroll-arrow {
        position: absolute;
        bottom: 10px; right: 10px;
    }
}
</style>