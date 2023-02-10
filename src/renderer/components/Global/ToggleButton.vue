<template>
    <div class="toggle-button" :class="{ checked: value, unchecked: !value }">
        <div class="toggle-button-main">
            <span class="toggle-button-main-text" v-text="text" />

            <ToggleButton
                ref="toggle-button"
                :value="value"
                :width="30"
                :height="15"
                @change="$emit('change')"
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
import { ToggleButton } from "vue-js-toggle-button";

export default {
    components: {
        ToggleButton
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
            type: Boolean,
            required: true
        }
    },

    methods: {
        toggle() {
            return this.$refs["toggle-button"].toggle();
        }
    }
};
</script>

<style lang="scss">
.toggle-button {
    display: flex;
    flex-direction: column;

    &-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;

        &-text {
            font-weight: 300;
            font-size: 12px;
        }
    }

    &.checked {
        .v-switch-core {
            background-color: var(--secondary) !important;
        }
    }

    &.unchecked {
        .v-switch-core {
            background-color: var(--switch-unchecked) !important;
        }
    }
}
</style>