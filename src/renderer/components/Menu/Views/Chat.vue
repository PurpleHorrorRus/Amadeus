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
            @click.native="parent.action('delete', -1, $event)" 
        />
    </div>
</template>

<script>
import DateMixin from "~/mixins/date";

export default {

    mixins: [DateMixin],
    props: {
        message: {
            type: Object,
            required: true
        }
    },

    computed: {
        canEdit() {
            return this.message.out
                && this.dateDiff(this.message).hours < 24;
        },

        parent() {
            return this.$parent.$parent;
        }
    }
};
</script>