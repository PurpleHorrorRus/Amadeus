<template>
    <div
        class="sticker"
        @mouseenter="turnAnimation(true)"
        @mouseleave="turnAnimation(false)"
    >
        <img
            v-if="!sticker.animated || !animate"
            :src="preview"
            class="sticker-image"
        >

        <lottie-vue-player
            v-else
            :src="image"
            class="sticker-image"
            autoplay
            loop
        />
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
        preview() {
            return this.settings.appearance.stickersTheme === 1
                ? this.sticker.sizesBackground.medium
                : this.sticker.sizes.medium;
        },

        image() {
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