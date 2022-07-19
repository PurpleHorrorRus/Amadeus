<template>
    <div id="message-page-input-attachments-gallery">
        <AttachmentItem
            v-for="(item, index) of attachments"
            :key="item.id"
            :item="item"
            :index="index"
            @remove="removeAttachment(index)"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    components: {
        AttachmentItem: () => import("~/components/Messages/Input/Item.vue")
    },

    props: {
        attachments: {
            type: Array,
            required: true
        }
    },

    created() {
        console.log(this.attachments);
    },

    methods: {
        ...mapActions({
            removeAttachment: "input/REMOVE_ATTACHMENT"
        })
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