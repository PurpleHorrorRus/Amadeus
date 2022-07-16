<template>
    <div class="doc" />
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
.doc {
    display: flex;
    flex-direction: row;
    column-gap: 10px;

    border-bottom: 1px solid var(--border);
}
</style>