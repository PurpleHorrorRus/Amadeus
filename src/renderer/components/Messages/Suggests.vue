<template>
    <div id="suggests">
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
        SuggestsSticker: () => import("./Suggests/Stickers.vue")
    },

    computed: {
        ...mapState({
            message: (state: any) => state.input.message,
            stickersWords: (state: any) => state.vk.messages.stickers.words
        }),

        stickers() {
            const message = this.message.toLowerCase().replaceAll("ё", "е");
            return this.stickersWords[message] || [];
        }
    }
};
</script>

<style lang="scss">
#suggests {
    position: absolute;
    left: 0px; bottom: 65px;
    
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    padding: 5px;

    width: 100%;
}
</style>