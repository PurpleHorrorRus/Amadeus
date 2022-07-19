<template>
    <div class="inline-doc-preview-doc">
        <DocumentIcon class="icon vkgram" />
    </div>
</template>

<script>
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

    background: var(--secondary);
}
</style>