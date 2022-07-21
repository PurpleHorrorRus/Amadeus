<template>
    <div id="stickers-block">
        <EmojiPicker v-if="currentCollectionIndex === -2" />
        <StickersCollection v-else @send="send($event)" />

        <StickersNavigation />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import StickersMixin from "./Stickers";
import CoreMixin from "~/mixins/core";

import Sticker from "~/instances/Messages/Attachments/Sticker";

export default {
    components: {
        EmojiPicker: () => import("./EmojiPicker.vue"),
        StickersCollection: () => import("./Collection.vue"),
        StickersNavigation: () => import("./Navigation.vue")
    },

    mixins: [CoreMixin, StickersMixin],

    data: () => ({
        currentCollectionIndex: 0 as number
    }),

    created() {
        this.currentCollectionIndex = "stickers" in this.favorite ? -1 : -2;
    },

    methods: {
        ...mapActions({
            sendSticker: "vk/messages/SEND_STICKER"
        }),

        send(sticker: Sticker) {
            this.$parent.$parent.closeMenu();
            this.sendSticker(sticker);
        },
        
        changeCollection(index: number) {
            this.currentCollectionIndex = index;
        }
    }
};
</script>

<style lang="scss">
#stickers-block {
    display: grid;
    grid-template-rows: 1fr 41px;
    grid-template-areas: "collection"
                        "navigation";

    height: 100%;
}
</style>