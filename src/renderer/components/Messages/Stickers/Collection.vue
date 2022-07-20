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
import StickersMixin from "./Stickers";

export default {
    components: {
        Sticker: () => import("./Collection/Sticker.vue")
    },

    mixins: [StickersMixin],

    computed: {
        currentCollection() {
            return this.$parent.currentCollectionIndex !== -1
                ? this.collections[this.$parent.currentCollectionIndex]
                : this.favorite;
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
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 10px;

        padding: 0px 0px 10px 1vw;

        overflow-y: auto;
    }
}
</style>