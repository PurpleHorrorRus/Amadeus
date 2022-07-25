<template>
    <div id="photo-gallery-albums">
        <PhotoAlbum
            v-for="album of items"
            :key="album.id"
            :album="album"
            @click.native="$parent.changeAlbum(album)"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        PhotoAlbum: () => import("~/components/Modal/Views/AddAttachments/Components/Photo/Album.vue")
    },

    props: {
        items: {
            type: Array,
            required: true
        }
    }
};
</script>

<style lang="scss">
#photo-gallery-albums {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>