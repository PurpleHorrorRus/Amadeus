<template>
    <div id="suggests">
        <SuggestsMention
            v-if="showMention" 
            :users="current.users" 
        />

        <SuggestsSticker 
            v-if="stickers.length > 0" 
            :stickers="stickers" 
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    components: {
        SuggestsSticker: () => import("./Suggests/Stickers.vue"),
        SuggestsMention: () => import("./Suggests/Mention.vue")
    },

    computed: {
        ...mapState({
            message: (state: any) => state.input.message,
            current: (state: any) => state.vk.messages.current,
            stickersWords: (state: any) => state.vk.messages.stickers.words
        }),

        stickers() {
            const message = this.message.toLowerCase().replaceAll("ё", "е");
            return this.stickersWords[message] || [];
        },

        showMention() {
            return this.current.isChat
                && this.message[this.message.length - 1] === "@"
                && this.current.users.length > 0;
        }
    }
};
</script>

<style lang="scss">
#suggests {
    position: absolute;
    left: 0px; bottom: 0px;

    padding: 5px;

    width: 100%;
}
</style>