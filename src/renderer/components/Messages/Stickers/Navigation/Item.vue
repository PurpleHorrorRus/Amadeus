<template>
    <div 
        v-tooltip="collection.title" 
        class="stickers-navigation-item"
        :class="itemClass"
    >
        <img 
            :src="collection.preview" 
            class="stickers-navigation-item-preview"
        >
    </div>
</template>

<script lang="ts">
export default {
    props: {
        collection: {
            type: Object,
            required: true
        }
    },

    computed: {
        itemClass() {
            return {
                active: this.collection.id === this.$parent.$parent.currentCollectionId
            };
        }
    }
};
</script>

<style lang="scss">
.stickers-navigation-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex: none;

    width: 35px;
    height: 35px;

    margin-top: 5px;

    border-bottom: 1px solid transparent;

    &:not(.active) {
        cursor: pointer;
    }

    &.active {
        border-bottom: 1px solid var(--secondary);
    }

    &-preview {
        width: 100%;
        height: 100%;
    }
}
</style>