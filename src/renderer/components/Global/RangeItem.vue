<template>
    <div class="range-item">
        <div class="range-item-main">
            <span
                class="range-item-main-text"
                v-text="text"
            />

            <VueRangeComponent
                :value="value"
                :min="min"
                :max="max"
                :step="step"
                :speed="0"
                :height="5"
                :width="150"
                :dot-size="10"
                :tooltip="'hover'"
                @slide-end="change"
            />
        </div>

        <span
            v-if="tip"
            class="modal-window-tip"
            v-text="tip"
        />
    </div>
</template>

<script lang="ts">
import { debounce } from "lodash";

const deb = debounce((context, value) => context.$emit("change", value), 500);

export default {
    components: {
        VueRangeComponent: () => import("vue-range-component")
    },

    props: {
        text: {
            type: String,
            required: true
        },

        tip: {
            type: String,
            required: false,
            default: ""
        },

        value: {
            type: [String, Number],
            required: true
        },

        min: {
            type: Number,
            required: false,
            default: 0
        },

        max: {
            type: Number,
            required: false,
            default: 100
        },

        step: {
            type: Number,
            required: false,
            default: 1
        }
    },

    methods: {
        change(value) {
            deb(this, value);
        }
    }
};
</script>

<style lang="scss">
.range-item {
    display: flex;
    flex-direction: column;

    &-main {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-text {
            font-weight: 300;
        }
    }

    .vue-range-slider.slider-component .slider .slider-process {
        background-color: var(--secondary) !important;
    }

    .slider-tooltip {
        border: 1px solid var(--secondary) !important;
        background-color: var(--secondary) !important;
    }
}
</style>