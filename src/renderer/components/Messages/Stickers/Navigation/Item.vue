<template>
    <div 
        v-tooltip="collection.title" 
        class="stickers-navigation-item"
        :class="itemClass"
    >
        <img 
            v-if="!icon"
            :src="collection.preview" 
            class="stickers-navigation-item-preview"
        >

        <Component :is="icon" v-else class="icon amadeus" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        collection: {
            type: Object,
            required: true
        },

        icon: {
            type: Object,
            required: false,
            default: null
        }
    },

    computed: {
        itemClass() {
            return {
                active: this.collection.id === this.$parent.$parent.currentCollectionIndex
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

    .icon {
        width: 26px !important;
    }
}
</style>