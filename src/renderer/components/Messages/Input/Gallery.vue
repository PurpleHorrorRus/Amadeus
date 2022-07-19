<template>
    <Draggable 
        v-bind="dragOptions" 
        id="message-page-input-attachments-gallery" 
        @change="$emit('sort', $event)"
    >
        <AttachmentItem
            v-for="(item, index) of attachments"
            :key="item.id"
            :item="item"
            :index="index"
            @remove="removeAttachment(index)"
        />
    </Draggable>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import Draggable from "vuedraggable";

export default {
    components: {
        AttachmentItem: () => import("~/components/Messages/Input/Item.vue"),
        Draggable
    },

    props: {
        attachments: {
            type: Array,
            required: true
        }
    },

    computed: {
        dragOptions() {
            return {
                list: this.attachments,
                draggable: ".message-attachment-item",
                ghostClass: "ghost",
                direction: "both",
                animation: 50,
                delay: 20,
                touchStartThreshold: 8,
                forceFallback: true
            };
        }
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