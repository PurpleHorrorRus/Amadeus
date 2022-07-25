<template>
    <div id="stickers-block">
        <EmojiPicker v-if="currentCollection.id === -2" />
        <StickersCollection
            v-else
            :collection="currentCollection"
            @send="send($event)"
        />

        <StickersNavigation />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";

import Sticker from "~/instances/Messages/Attachments/Sticker";
import StickersCollection from "~/instances/Messages/StickersCollection";

export default {
    components: {
        EmojiPicker: () => import("./EmojiPicker.vue"),
        StickersCollection: () => import("./Collection.vue"),
        StickersNavigation: () => import("./Navigation.vue")
    },

    mixins: [CoreMixin],

    data: () => ({
        currentCollection: {
            id: -2
        } as StickersCollection
    }),

    computed: {
        ...mapState({
            collections: (state: any) => state.vk.messages.stickers.collections,
            favorite: (state: any) => state.vk.messages.stickers.favorite,
            emoji: (state: any) => state.vk.messages.stickers.emoji
        })
    },

    created() {
        this.changeCollection(this.emoji);
    },

    methods: {
        ...mapActions({
            sendSticker: "vk/messages/SEND_STICKER"
        }),

        send(sticker: Sticker) {
            this.$parent.$parent.closeMenu();
            this.sendSticker(sticker);
        },

        changeCollection(collection: StickersCollection) {
            this.currentCollection = collection;
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