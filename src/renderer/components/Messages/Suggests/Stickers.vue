<template>
    <SuggestBlock id="suggests-stickers" ref="stickers" @mousewheel.native="scroll">
        <Sticker
            v-for="sticker of stickers"
            :key="sticker.id"
            :sticker="sticker"
            @click.native="send(sticker)"
        />
    </SuggestBlock>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import Sticker from "~/instances/Messages/Attachments/Sticker";

export default {
    components: {
        SuggestBlock: () => import("./Block.vue"),
        Sticker: () => import("~/components/Messages/Stickers/Collection/Sticker.vue")
    },

    props: {
        stickers: {
            type: Array,
            required: true
        }
    },

    methods: {
        ...mapActions({
            sendSticker: "vk/messages/SEND_STICKER",
            setMessage: "input/SET_MESSAGE"
        }),

        send(sticker: Sticker) {
            this.sendSticker(sticker);
            this.setMessage("");
        },

        scroll(event) {
            this.$refs.stickers.$el.scrollLeft += event.deltaY;
        }
    }
};
</script>

<style lang="scss">
#suggests-stickers {
    display: flex;
    flex-direction: row;
    column-gap: 10px;

    width: max-content;
    max-width: 100%;

    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        height: 0px;
    }

    .sticker {
        flex: none;

        width: 100px;
        height: 100px;
    }
}
</style>