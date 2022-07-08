<template>
    <div id="chat-message-view" class="menu-view">
        <ContextMenuItem 
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

    computed: {
        canEdit() {
            return this.message.out
                && this.dateDiff(this.message).hours() < 24
                && !this.checkBlockedAttachments(this.message);
        },

        canDeleteForAll() {
            return this.message.out
                && this.dateDiff(this.message).hours() < 24;
        },

        parent() {
            return this.$parent.$parent;
        }
    }
};
</script>