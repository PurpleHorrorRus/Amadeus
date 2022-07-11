<template>
    <div id="chat-message-view" class="menu-view">
        <ContextMenuItem 
            v-if="canReply"
            label="Ответить" 
            @select="action('reply')" 
        />

        <ContextMenuItem 
            v-if="canEdit" 
            label="Редактировать" 
            @select="action('edit')" 
        />

        <ContextMenuItem 
            label="Удалить" 
            @select="action('delete')" 
        />

        <ContextMenuItem 
            v-if="canDeleteForAll"
            label="Удалить для всех" 
            @select="action('delete-for-all')" 
        />
    </div>
</template>

<script>
import { mapState } from "vuex";

import AttachmentsMixin from "~/mixins/attachments";
import ActionsMixin from "~/mixins/actions";
import DateMixin from "~/mixins/date";

export default {
    mixins: [AttachmentsMixin, ActionsMixin, DateMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        hours: 0
    }),

    computed: {
        ...mapState({
            current: state => state.vk.messages.current,
            user: state => state.vk.user
        }),

        canReply() {
            return this.current.information.can_write.allowed;
        },

        canEdit() {
            return this.message.out
                && this.hours < 24
                && !this.checkBlockedAttachments(this.message);
        },

        canDeleteForAll() {
            return this.message.out
                && this.hours < 24
                && this.current.id !== this.user.id;
        }
    },

    created() {
        this.hours = this.dateDiff(this.message).hours();
    }
};
</script>