<template>
    <div id="message-page-input-attachments-gallery">
        <AttachmentItem
            v-for="(item, index) of attachments"
            :key="item.id"
            :item="item"
            @remove="remove(index)"
        />
    </div>
</template>

<script>
export default {
    components: {
        AttachmentItem: () => import("~/components/Messages/Input/Item")
    },

    props: {
        attachments: {
            type: Array,
            required: true
        }
    },

    methods: {
        remove(index) {
            this.$parent.attachments.splice(index, 1);
        }
    }
};
</script>

<style lang="scss">
#message-page-input-attachments-gallery {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;

    width: 100%;
    max-height: 280px;

    padding: 10px 0px;

    overflow-x: hidden;
    overflow-y: auto;
    
    .gallery-item {
        border-radius: 0px;
    }
}
</style>