<template>
    <div class="attachments-item-doc-gif" @click="action">
        <div v-if="!playing" class="attachments-item-doc-gif-preview">
            <div class="attachments-item-doc-gif-preview-size">
                <span 
                    class="attachments-item-doc-gif-preview-size-label" 
                    v-text="size" 
                />
            </div>

            <img 
                :src="preview" 
                class="attachments-item-doc-gif-preview-image"
            >
        </div>

        <img 
            v-else
            :src="item.doc.url" 
            class="attachments-item-doc-gif-playing"
        >
    </div>
</template>

<script>
import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";

export default {
    mixins: [DocMixin],

    data: () => ({
        playing: false,
        preview: ""
    }),

    created() {
        this.preview = this.calculateMaxSize(this.item.doc.preview.photo.sizes, "src");
    },

    methods: {
        action() {
            this.playing = !this.playing;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-doc-gif {
    width: max-content;
    height: max-content;
    
    &-preview {
        position: relative;

        width: 100%;
        height: 13vh;

        &-image {
            width: 100%;
            height: 100%;

            border-radius: 8px;
        }

        &-size {
            position: absolute;
            top: 5px; left: 5px;
            
            display: flex;
            justify-content: center;
            align-items: center;

            padding: 5px;

            background: #00000080;
            border-radius: 4px;

            &-label {
                font-size: 11px;
            }
        }
    }

    &-playing {
        width: 35vw;
    }
}
</style>