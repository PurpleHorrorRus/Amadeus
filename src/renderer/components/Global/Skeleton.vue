<template>
    <SkeletonTheme class="skeleton">
        <div v-if="count > 1" class="skeleton-list">
            <Skeleton 
                v-for="index of count" 
                :key="index" 
                :width="width" 
                :height="height" 
                class="skeleton-loading" 
            />
        </div>

        <Skeleton 
            v-else 
            :width="width" 
            :height="height" 
            class="skeleton-loading" 
        />
    </SkeletonTheme>
</template>

<script>
import { SkeletonTheme, Skeleton } from "vue-loading-skeleton";

export default {
    components: {
        SkeletonTheme,
        Skeleton
    },

    props: {
        count: {
            type: Number,
            required: false,
            default: 1
        },

        width: {
            type: String,
            required: false,
            default: "100%"
        },

        height: {
            type: String,
            required: false,
            default: "100%"
        }
    }
};
</script>

<style lang="scss">
.skeleton {
    display: flex;

    &-list {
        display: flex;
        justify-content: space-evenly;
        row-gap: 5px;

        width: 100%;

        padding: 5px;
        margin-top: 5px;
    }

    .skeleton-loading {
        border-radius: 4px;

        .pu-skeleton {
            background-color: var(--skeleton-background) !important;
            background-image: linear-gradient(
                90deg,
                var(--skeleton-background),
                var(--skeleton-highlight),
                var(--skeleton-background)
            ) !important;
        }
    }
}
</style>