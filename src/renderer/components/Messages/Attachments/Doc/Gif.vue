<template>
    <div class="attachments-item attachments-item-doc-gif" @click.stop="turnPlaying">
        <GifPreview v-if="!item.playing" :item="item" />
        <GifPlaying v-else :item="item" />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";

export default {
    components: {
        GifPreview: () => import("~/components/Messages/Attachments/Doc/Gif/Preview"),
        GifPlaying: () => import("~/components/Messages/Attachments/Doc/Gif/Playing")
    },

    mixins: [CoreMixin],

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    methods: {
        turnPlaying() {
            !this.item.playing 
                ? this.item.play() 
                : this.item.stop();
        }
    }
};
</script>

<style lang="scss">
.attachments-item-doc-gif {
    height: auto;
}
</style>