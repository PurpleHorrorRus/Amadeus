<template>
    <div id="stickers-block-navigation" ref="navigation" @mousewheel="scroll" @click.stop>
        <NavigationItem
            v-for="collection of collections"
            :key="collection.id"
            :collection="collection"
            @click.stop.native="$parent.changeCollection(collection.id)"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    components: {
        NavigationItem: () => import("./Navigation/Item.vue")
    },

    computed: {
        ...mapState({
            collections: (state: any) => state.vk.messages.stickers.collections
        })
    },

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