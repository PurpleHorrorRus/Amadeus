<template>
    <div id="stickers-block">
        <StickersCollection @send="sendSticker($event)" />
        <StickersNavigation />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import StickersMixin from "./Stickers";
import CoreMixin from "~/mixins/core";

export default {
    components: {
        StickersCollection: () => import("./Collection.vue"),
        StickersNavigation: () => import("./Navigation.vue")
    },

    mixins: [CoreMixin, StickersMixin],

    data: () => ({
        currentCollectionId: 0 as number
    }),

    created() {
        const firstCollection: any = Object.values(this.collections)[0];
        this.currentCollectionId = "stickers" in this.favorite
            ? -1 
            : firstCollection.id;
    },

    methods: {
        ...mapActions({
            sendSticker: "vk/messages/SEND_STICKER"
        }),
        
        changeCollection(id: number) {
            this.currentCollectionId = id;
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

    width: 33rem;
    height: 100%;
}
</style>