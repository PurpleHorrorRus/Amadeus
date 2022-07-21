<template>
    <div id="media-page-navigation">
        <div 
            v-if="canPrevious" 
            id="left" 
            class="media-navigation-item"
            @click.stop="$parent.changeMedia(-1)"
        >
            <ChevronLeftIcon class="icon" />
        </div>
        
        <div 
            v-if="canNext" 
            id="right"
            class="media-navigation-item" 
            @click.stop="$parent.changeMedia(1)"
        >
            <ChevronRightIcon class="icon" />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    components: {
        ChevronLeftIcon: () => import("~icons/chevron-left.svg"),
        ChevronRightIcon: () => import("~icons/chevron-right.svg")
    },

    computed: {
        canPrevious() {
            return this.$parent.media.index > 0;
        },

        canNext() {
            return this.$parent.media.index < this.$parent.media.data.length - 1;
        }
    }
};
</script>

<style lang="scss">
#media-page-navigation {
    position: absolute;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 100%;

    .media-navigation-item {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 30px;
        height: 60px;

        background: var(--secondary-opacity-half);
        
        cursor: pointer;

        &:hover {
            background: var(--secondary);
        }
        
        &#left, &#right {
            position: absolute;
        }

        &#left {
            left: 0px;
        }

        &#right {
            right: 0px;
        }
    }
}
</style>