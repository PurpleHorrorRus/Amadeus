<template>
    <div class="color-picker">
        <span v-if="text" class="color-picker-item-text" v-text="text" />

        <div class="color-picker-preview" @click="turnPicker">
            <div class="color-picker-preview-color" :style="previewColorStyle" />
            <span class="color-picker-preview-hex" v-text="value" />
        </div>

        <ColorPicker
            v-if="show"
            v-click-away="close"
            v-scroll-outside="close"
            :value="value"
            :withSuggestions="false"
            :style="pickerStyle"
            class="color-picker-object" 
            @input="input"
        />
    </div>
</template>

<script>
export default {
    components: {
        ColorPicker: () => import("@uscreen-video/v-color")
    },

    props: {
        variable: {
            type: String,
            required: true
        },

        value: {
            type: String,
            required: false,
            default: ""
        },

        text: {
            type: String,
            required: false,
            default: ""
        },

        tip: {
            type: String,
            required: false,
            default: ""
        }
    },

    data: () => ({
        show: false,

        position: {
            left: 0,
            top: 0
        }
    }),

    computed: {
        previewColorStyle() {
            return {
                backgroundColor: this.value
            };
        },

        pickerStyle() {
            return {
                left: this.position.left + "px",
                top: this.position.top + "px"
            };
        }
    },
    
    methods: {
        turnPicker(event) {
            this.position.left = event.clientX - 50;
            this.position.top = event.clientY + 20;

            this.show = !this.show;
        },

        close() {
            if (!this.show) {
                return false;
            }

            this.show = false;
            return true;
        },

        input(value) {
            return this.$emit("input", { 
                variable: this.variable,
                value
            });
        }
    }
};
</script>

<style lang="scss">
.color-picker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-preview {
        display: grid;
        grid-template-columns: 20px 1fr;
        align-items: center;
        column-gap: 5px;

        cursor: pointer;

        &-color {
            width: 20px;
            height: 20px;

            border-radius: 100%;
        }
    }

    &-object {
        position: absolute;

        width: 25vw;

        z-index: 1001;
    }

    .controls {
        background: var(--item);
    }

    select {
        width: 100px !important;
        background-image: none !important;
    }

    input, select {
        color: var(--text) !important;
        border-radius: 4px;
        background: var(--backdrop);

        padding: 10px !important;

        font-family: Roboto !important;
        user-select: all !important;
    }
}
</style>