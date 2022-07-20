<template>
    <div id="stickers-block-collection" @click.stop>
        <span 
            id="stickers-block-collection-title" 
            v-text="currentCollection.title" 
        />

        <div id="stickers-block-collection-list">
            <Sticker 
                v-for="sticker of currentCollection.stickers"
                :key="sticker.id"
                :sticker="sticker"
                @click.native="$emit('send', sticker)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    components: {
        Sticker: () => import("./Collection/Sticker.vue")
    },

    computed: {
        ...mapState({
            collections: (state: any) => state.vk.messages.stickers.collections
        }),

        currentCollection() {
            return this.collections[this.$parent.currentCollectionId];
        }
    }
};
</script>

<style lang="scss">
#stickers-block-collection {
    grid-area: collection;

    display: flex;
    flex-direction: column;
    row-gap: 10px;

    overflow-y: auto;

    &-title {
        display: block;

        margin: 10px 0px 0px 10px;
    }
        
    &-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        padding: 0px 0px 10px 6px;

        overflow-y: auto;
    }
}
</style>