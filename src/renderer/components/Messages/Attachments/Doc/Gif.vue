<template>
    <div class="attachments-item attachments-item-doc-gif" @click.stop="turnPlaying">
        <GifPreview v-if="!item.playing" :item="item" />
        <GifPlaying v-else :item="item" />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    components: {
        GifPreview: () => import("~/components/Messages/Attachments/Doc/Gif/Preview.vue"),
        GifPlaying: () => import("~/components/Messages/Attachments/Doc/Gif/Playing.vue")
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
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
}
</style>