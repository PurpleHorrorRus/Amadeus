<template>
    <div id="chat-message-view" class="menu-view">
        <ContextMenuItem 
            label="Ответить" 
            @click.native="parent.action('reply')" 
        />

        <ContextMenuItem 
            v-if="message.out" 
            label="Редактировать" 
            @click.native="parent.action('edit')" 
        />

        <ContextMenuItem 
            label="Удалить" 
            @click.native="parent.action('delete')" 
        />
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    },

    computed: {
        parent() {
            return this.$parent.$parent;
        }
    }
};
</script>