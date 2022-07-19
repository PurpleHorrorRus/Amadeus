<template>
    <div class="inline-doc-preview-gif">
        <img :src="item.sizes.medium" class="inline-doc-preview-gif-image">
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.inline-doc-preview-gif {
    width: 100%;
    height: 100%;
    
    object-fit: cover;

    &-image {
        width: 100%;
        height: 100%;

        object-fit: cover;
    }
}
</style>