import { mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            collections: (state: any) => state.vk.messages.stickers.collections,
            favorite: (state: any) => state.vk.messages.stickers.favorite,
            emoji: (state: any) => state.vk.messages.stickers.emoji
        })
    }
};