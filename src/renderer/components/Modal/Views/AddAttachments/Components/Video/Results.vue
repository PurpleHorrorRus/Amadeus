<template>
    <div class="video-gallery-results">
        <span 
            v-if="label"
            class="video-gallery-results-label" 
            v-text="label" 
        />
                    
        <div ref="list" class="video-gallery-results-list">
            <SelectableItem 
                v-for="item of items"
                :key="item.id"
                :component="VideoComponent"
                :item="item"
                @select="$parent.$emit('select', item)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import VideoComponent from "~/components/Messages/Attachments/Gallery/Video.vue";

export default {
    components: {
        SelectableItem: () => import("~/components/Modal/Views/AddAttachments/Components/Item.vue")
    },

    props: {
        items: {
            type: Array,
            required: true
        },

        label: {
            type: String,
            required: false,
            default: ""
        }
    },

    data: () => ({
        VideoComponent
    })
};
</script>

<style lang="scss">
.video-gallery-results {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &-list {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1.7vw;
        row-gap: 15px;

        max-height: 50vh;

        padding: 0px 0px 10px 10px;

        overflow-x: hidden;
        overflow-y: auto;

        .attachments-item-video {
            grid-template-rows: 10vw 20px;
        }
    }
}
</style>