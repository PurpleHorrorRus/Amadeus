<template>
    <div class="inline-doc-preview-doc">
        <DocumentIcon class="icon amadeus" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        DocumentIcon: () => import("~icons/document.svg")
    }
};
</script>

<style lang="scss">
.inline-doc-preview-doc {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: var(--secondary);
}
</style>