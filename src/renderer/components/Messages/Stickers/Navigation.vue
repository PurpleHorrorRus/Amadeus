<template>
    <div id="stickers-block-navigation" ref="navigation" @mousewheel="scroll" @click.stop>
        <NavigationItem
            :collection="$parent.favorite"
            :icon="StarIcon"
            @click.stop.native="$parent.changeCollection($parent.favorite)"
        />

        <NavigationItem
            :collection="$parent.emoji"
            :icon="EmojiIcon"
            @click.stop.native="$parent.changeCollection($parent.emoji)"
        />

        <NavigationItem
            v-for="collection of $parent.collections"
            :key="collection.id"
            :collection="collection"
            @click.stop.native="$parent.changeCollection(collection)"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        NavigationItem: () => import("./Navigation/Item.vue")
    },

    data: () => ({
        StarIcon: () => import("~icons/star.svg"),
        EmojiIcon: () => import("~icons/emoji.svg")
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