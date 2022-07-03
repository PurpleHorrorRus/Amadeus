<template>
    <div class="message-attachment message-attachment-photo">
        <img :src="data" class="message-attachment-photo-image">
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: String,
            required: true
        }
    }
};
</script>

<style lang="scss">
.message-attachment-photo {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    background: var(--backdrop);
    border-radius: 4px;

    &-image {
        width: 100%;
        height: 100%;
    }
}
</style>