<template>
    <div
        ref="line"
        class="line"
        :class="lineClass"
        @click.capture="select"
        @mousedown.left="pressing(true)"
        @mouseup.left="pressing(false)"
        @mouseenter="turnTooltip(true)"
        @mouseleave="turnTooltip(false)"
        @mousemove="onMouseMove"
    >
        <div
            class="line-progress"
            :style="progressStyle"
        />

        <transition name="fade">
            <span
                v-if="showTooltip"
                ref="tooltip"
                class="line-tooltip"
                :style="tooltipStyle"
                v-text="tooltipValue"
            />
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            required: true
        },

        max: {
            type: Number,
            required: false,
            default: 100
        },

        tooltipValue: {
            type: String,
            required: false,
            default: ""
        },

        parentMove: {
            type: Boolean,
            required: false,
            default: false
        },

        parentDown: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data: () => ({
        tooltip: {
            show: false,
            x: 0,
            width: 0,
            value: ""
        },

        press: false,
        parentOffset: 0
    }),

    computed: {
        lineClass() {
            return {
                press: this.press
            };
        },

        progress() {
            return Math.min((this.value / this.max) * 100, 100);
        },

        progressStyle() {
            return {
                width: `${this.progress}%`
            };
        },

        showTooltip() {
            return this.tooltipValue
                && (this.tooltip.show || this.press);
        },

        tooltipStyle() {
            return {
                left: `${(this.tooltip.x - (this.tooltip.width / 2))}px`
            };
        }
    },

    mounted() {
        if (this.parentMove) {
            this.parentOffset = this.$el.getBoundingClientRect().left - this.$parent.$el.getBoundingClientRect().left;

            if (this.parentDown) {
                this.$parent.$el.onmousedown = event => {
                    if (event.which !== 1) {
                        return false;
                    }

                    this.select(event);
                    return this.pressing(true);
                };
            }

            this.$parent.$el.onmouseup = () => {
                return this.pressing(false);
            };

            this.$parent.$el.onmouseleave = () => {
                return this.pressing(false);
            };

            this.$parent.$el.onmousemove = event => {
                return this.onMouseMove(event);
            };
        }
    },

    beforeDestroy() {
        if (this.parentMove) {
            if (this.parentDown) {
                this.$parent.$el.onmousedown = () => (false);
            }

            this.$parent.$el.onmouseup = () => (false);
            this.$parent.$el.onmouseleave = () => (false);
            this.$parent.$el.onmousemove = () => (false);
        }
    },

    methods: {
        getPercent(event) {
            const width = this.$refs.line.clientWidth;
            const offsetX = this.parentMove && event.target === this.$parent.$el
                ? (event.offsetX - this.parentOffset)
                : event.offsetX;

            return Math.min(Math.max((offsetX / width) * 100, 0), 100);
        },

        select(event) {
            const value = this.max / 100;
            return this.$emit("select", value * this.getPercent(event));
        },

        onMouseMove(event) {
            this.updateTooltip(event);

            if (this.press) {
                this.select(event);
            }
        },

        pressing(sequence) {
            this.press = sequence;
            return this.press;
        },

        turnTooltip(sequence) {
            this.tooltip.show = this.tooltipValue && sequence;
            return this.tooltip.show;
        },

        updateTooltip(event) {
            if (!this.tooltipValue) {
                return false;
            }

            this.$nextTick(() => {
                this.tooltip.x = event.offsetX;
                this.tooltip.width = this.$refs.tooltip?.clientWidth || 0;
                return this.$emit("updateTooltip", (this.max / 100) * this.getPercent(event));
            });
        }
    }
};
</script>

<style lang="scss">
.line {
    position: relative;

    width: 100%;
    height: 4px;

    background-color: var(--player-slider);
    border-radius: 6px;

    &:hover, &.press {
        .line-progress {
            background-color: var(--secondary);

            &::after {
                transform: scale(1);
            }
        }
    }

    &-progress {
        position: absolute;
        inset: 0px;

        height: 100%;

        background-color: var(--player-slider-progress);
        border-radius: 6px;

        &::after {
            content: "";

            position: absolute;
            right: -4px; bottom: -2px;

            width: 8px;
            height: 8px;

            background-color: #ffffff;
            border-radius: 100%;

            transform: scale(0);

            transition: transform .1s ease-in-out;
        }
    }

    &-tooltip {
        position: absolute;
        bottom: 10px;

        padding: 5px;

        background-color: var(--secondary);
        border-radius: 2px;

        font-size: 11px;

        pointer-events: none;
    }
}
</style>