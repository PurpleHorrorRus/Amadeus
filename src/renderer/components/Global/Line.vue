<template>
    <div class="line" :style="lineStyle">
        <div
            class="line-click" 
            @click="calculate" 
            @mousedown="hold" 
            @mouseup="release"
            @mousemove="move" 
            @mouseleave="release"
        />

        <div class="line-range">
            <div class="line-range-progress" :style="progressStyle">
                <div class="line-range-progress-dot" />
            </div>
        </div>
    </div> 
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            required: false,
            default: 0
        },

        width: {
            type: Number,
            required: false,
            default: 100
        }
    },
    
    data: () => ({
        mutated: 0,
        clicked: false
    }),

    computed: {
        lineStyle() {
            return {
                width: this.width + "px"
            };
        },

        progressStyle() {
            return {
                width: this.mutated + "%"
            };
        }
    },

    created() {
        this.mutated = this.value;
    },

    methods: {
        hold(event) {
            if (!this.clicked) {
                this.clicked = true;
                this.calculate(event);
                return true;
            }

            return false;
        },

        release() {
            if (this.clicked) {
                this.clicked = false;
                return true;
            }
            
            return false;
        },
        
        move(event) {
            if (!this.clicked) {
                return false;
            }

            return this.calculate(event);
        },

        calculate(event) {
            this.mutated = Math.min(Math.max((event.offsetX / this.width) * 100, 0), 100);
            this.$emit("change", this.mutated);
            return true;
        }
    }
};
</script>

<style lang="scss">
.line {
    grid-area: line;

    position: relative;


    display: flex;
    align-items: center;

    height: 100%;

    &:hover {
        .line-range-progress {
            background: var(--secondary);

            &-dot {
                opacity: 1;
            }
        }
    }

    &-click {
        position: absolute;
        left: 0px; top: -10px;

        width: 100%;
        height: 25px;

        // border: 1px solid #ffffff;
        // background: #fff;
        z-index: 2;

        &:hover {
            cursor: pointer;
        }
    }

    &-range {
        position: relative;

        width: 100%;
        height: 4px;

        background: var(--player-slider);
        border-radius: 4px;

        z-index: 1;

        &-progress {
            position: absolute;
            top: 0px; left: 0px;

            width: 20px;
            height: 100%;

            background: var(--player-slider-progress);
            border-radius: 4px;

            pointer-events: auto;

            transition: background .08s ease-in-out;

            &-dot {
                position: absolute;
                top: -2px; right: -4px;

                width: 8px;
                height: 8px;

                background: #ffffff;
                border-radius: 100%;

                opacity: 0;
                transition: opacity .08s ease;
            }
        }
    }
}
</style>