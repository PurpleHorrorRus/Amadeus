<template>
    <div id="chat-message-view" class="menu-view">
        <ContextMenuItem 
            v-if="canReply"
            label="Ответить" 
            @click.native="parent.action('reply')" 
        />

        <ContextMenuItem 
            v-if="canEdit" 
            label="Редактировать" 
            @click.native="parent.action('edit')" 
        />

        <ContextMenuItem 
            label="Удалить" 
            @click.native="parent.action('delete')" 
        />

        <ContextMenuItem 
            v-if="canDeleteForAll"
            label="Удалить для всех" 
            @click.native="parent.action('delete-for-all')" 
        />
    </div>
</template>

<script>
import AttachmentsMixin from "~/mixins/attachments";
import DateMixin from "~/mixins/date";

export default {
    mixins: [AttachmentsMixin, DateMixin],

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
        canReply() {
            return this.parent.current.information.can_write.allowed;
        },

        canEdit() {
            return this.message.out
                && this.hours < 24
                && !this.checkBlockedAttachments(this.message);
        },

        canDeleteForAll() {
            return this.message.out
                && this.hours < 24
                && !this.parent.itsMe;
        },

        parent() {
            return this.$parent.$parent;
        }
    },

    created() {
        this.hours = this.dateDiff(this.message).hours();
    }
};
</script>