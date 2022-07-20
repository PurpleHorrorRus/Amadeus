<template>
    <div id="chat-page-messages-list">
        <MessagesChunk
            v-for="(chunk, index) of chunks"
            :key="index" 
            :chunk="chunk"
        />

        <ContextMenu 
            v-if="menu.show" 
            :menu="menu" 
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/attachments";
import MenuMixin from "~/mixins/menu";
import DateMixin from "~/mixins/date";
import ActionsMixin from "~/mixins/actions";

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
        chunks() {
            const chunks = [];
            let current = [];

            for (const message of this.messages) {
                if (current.length === 0) {
                    current.push(message);
                    continue;
                } 
                
                if (current[current.length - 1].from_id !== message.from_id) {
                    chunks.push(current);
                    current = [message];
                } else current.push(message);
            }

            if (current.length > 0) {
                chunks.push(current);
            }

            return chunks;
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
                label: "Ответить",
                show: this.current.information.can_write.allowed,
                function: () => this.action("reply", message)
            },
            
            {
                id: "edit",
                label: "Редактировать",
                show: this.menu.target
                    && hours < 24
                    && !this.checkBlockedAttachments(this.menu.target),

                function: () => this.action("edit", message)
            },
            
            {
                id: "delete",
                label: "Удалить",
                function: () => this.action("delete", message)
            },
            
            {
                id: "delete-for-all",
                label: "Удалить для всех",
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
    row-gap: 10px;

    width: 100%;
    height: 100%;

    padding: 10px;

    overflow-y: auto;
    
    .scroll-arrow {
        position: absolute;
        bottom: 10px; right: 10px;
    }
}
</style>