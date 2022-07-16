<template>
    <div class="photo-album">
        <img :src="album.thumb_src" class="photo-album-cover">
        <span class="photo-album-title nowrap" v-text="album.title" />
    </div>
</template>

<script>
export default {
    props: {
        album: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.photo-album {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    border-radius: 4px;

    transition: background .2s ease;
    cursor: pointer;

    &:hover {
        background: var(--item-hover);
    }

    &-cover {
        width: 40px;
        height: 40px;

        object-fit: cover;
        border-radius: 8px;
    }
}
</style>