<template>
    <div id="photo-gallery-items">
        <Dropdown 
            :options="albumTitles"
            :selected="selectedAlbum"
            @change="$parent.changeAlbum($parent.albums.items[$event])"
        />

        <div id="photo-gallery-items-list" ref="list">
            <SelectableItem 
                v-for="item of items"
                :key="item.id"
                :component="GalleryPhoto"
                :item="item"
                @select="$parent.$emit('select', item)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import GalleryPhoto from "~/components/Messages/Attachments/Gallery/Photo.vue";

export default {
    components: {
        SelectableItem: () => import("~/components/Modal/Views/AddAttachments/Components/Item.vue")
    },

    props: {
        items: {
            type: Array,
            required: true
        }
    },

    data: () => ({
        GalleryPhoto
    }),

    computed: {
        albumTitles() {
            return this.$parent.albums.items.map(album => {
                return album.title;
            });
        },

        selectedAlbum() {
            return this.$parent.albums.items.findIndex(album => {
                return album.id === this.$parent.current.id;
            });
        }
    }
};
</script>

<style lang="scss">
#photo-gallery-items {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    max-height: 70vh;

    .dropdown-item {
        select {
            text-align: left;
            text-align-last: left;
        }

        option {
            direction: ltr;
        }
    }

    &-title {
        margin: 5px 15px;

        font-size: 12px;
    }

    &-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;

        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>