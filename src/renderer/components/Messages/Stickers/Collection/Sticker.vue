<template>
    <div
        class="sticker"
        @mouseenter="turnAnimation(true)"
        @mouseleave="turnAnimation(false)"
    >
        <lottie-vue-player
            v-if="animate"
            :src="image"
            class="sticker-image"
            autoplay
            loop
        />

        <img
            v-else
            :key="settings.appearance.stickersTheme"
            :src="image"
            class="sticker-image"
        >
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],

    props: {
        sticker: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        animate: false as boolean
    }),

    computed: {
        image() {
            if (!this.animate) {
                return this.settings.appearance.stickersTheme === 1
                    ? this.sticker.sizesBackground.max
                    : this.sticker.sizes.max;
            }

            return this.settings.appearance.stickersTheme === 1
                ? this.sticker.dark
                : this.sticker.light;
        }
    },

    methods: {
        turnAnimation(animate) {
            if (!this.sticker.animated) {
                return false;
            }

            this.animate = animate;
        }
    }
};
</script>

<style lang="scss">
.sticker {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 31%;
    height: auto;

    padding: 10px;

    border-radius: 4px;

    cursor: pointer;

    &:hover {
        background: var(--secondary-hover);
    }

    &-image {
        width: 100%;
        height: 100%;

        background: none;

        .lf-spinner {
            display: none;
        }
    }
}
</style>