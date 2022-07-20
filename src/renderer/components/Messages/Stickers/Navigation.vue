<template>
    <div id="stickers-block-navigation" ref="navigation" @mousewheel="scroll" @click.stop>
        <NavigationItem
            :collection="favorite"
            :icon="StarIcon"
            @click.stop.native="$parent.changeCollection(favorite.id)"
        />

        <NavigationItem
            v-for="(collection, index) of collections"
            :key="collection.id"
            :collection="collection"
            @click.stop.native="$parent.changeCollection(index)"
        />
    </div>
</template>

<script lang="ts">
import StickersMixin from "./Stickers";

import StarIcon from "~icons/star.svg";

export default {
    components: {
        NavigationItem: () => import("./Navigation/Item.vue")
    },

    mixins: [StickersMixin],

    data: () => ({
        StarIcon
    }),

    methods: {
        scroll(event) {
            this.$refs.navigation.scrollLeft += event.deltaY;
        }
    }
};
</script>

<style lang="scss">
#stickers-block-navigation {
    grid-area: navigation;

    display: flex;
    flex-direction: row;
    column-gap: 10px;

    overflow-x: auto;
    overflow-y: hidden;

    border-top: 1px solid var(--border);

    &::-webkit-scrollbar {
        height: 0px;
    }
}
</style>