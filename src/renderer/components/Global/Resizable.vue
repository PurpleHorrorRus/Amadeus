<template>
    <div
        ref="resizable"
        :class="resizableClass"
        :style="resizableStyle"
    >
        <slot name="thumb" />
        <slot name="default" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        anchor: {
            type: String,
            required: false,
            default: "top"
        },

        direction: {
            type: String,
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
            default: Infinity
        },

        value: {
            type: Number,
            required: true
        }
    },

    data: () => ({
        resizableRef: {
            clickThumb: false,
            resize: false,
            holdThumb: () => (false),
            releaseThumb: () => (false),
            calculate: () => (false)
        },

        clickThumb: false,
        resize: false
    }),

    computed: {
        resizableClass() {
            return {
                [this.direction]: true
            };
        },

        resizableStyle() {
            return {
                [this.direction === "horizontal" ? "width" : "height"]: this.value + "px",
                [this.anchor]: "0px"
            };
        }
    },

    mounted() {
        this.valueMutated = this.value;
        this.resizableRef = this;
        this.$emit("mounted", this);
    },

    methods: {
        holdThumb() {
            this.clickThumb = true;
            setTimeout(() => {
                return !this.clickThumb
                    ? this.$emit("clicked")
                    : this.resize = true;
            }, 100);
        },

        releaseThumb() {
            if (this.clickThumb) {
                this.clickThumb = false;
            }

            if (this.resize) {
                this.resize = false;
                this.$emit("resized");
            }
        },

        calculate(e) {
            if (this.resize) {
                this.valueMutated = Math.min(
                    Math.max(this.direction === "horizontal" ? e.pageX : e.pageY, this.min),
                    this.max
                );

                this.$emit("resize", {
                    position: this.direction === "horizontal" ? e.pageX : e.pageY,
                    size: this.valueMutated
                });
            }
        }
    }
};
</script>

<style lang="scss">
.resizable {
    position: absolute;
    left: 0px;

    &-thumb {
        z-index: 1;
    }

    &.horizontal {
        .resizable-thumb:hover {
            cursor: ew-resize;
        }
    }

    &.vertical {
        .resizable-thumb:hover {
            cursor: ns-resize;
        }
    }
}
</style>