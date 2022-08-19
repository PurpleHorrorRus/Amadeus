<template>
    <div id="stickers-block-collection" @click.stop>
        <span
            id="stickers-block-collection-title"
            class="small-text"
            v-text="collection.title"
        />

        <div id="stickers-block-collection-list">
            <Sticker
                v-for="sticker of collection.stickers"
                :key="sticker.id"
                :item="sticker"
                class="clickable"
                @click.native="$emit('send', sticker)"
            />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    components: {
        Sticker: () => import("~/components/Messages/Attachments/Sticker.vue")
    },

    props: {
        collection: {
            type: Object,
            required: true
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
        column-gap: 5%;
        row-gap: 5px;

        padding: 0px 0px 10px 1vw;

        overflow-y: auto;

        .attachments-item-sticker {
            width: 20.5%;
            min-width: unset !important;
        }
    }
}
</style>