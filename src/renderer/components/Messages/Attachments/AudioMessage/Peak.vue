<template>
    <div
        class="attachments-item-audiomessage-waveform-peak"
        :class="peakClass"
        :style="peakStyle"
    />
</template>

<script lang="ts">
export default {
    props: {
        peak: {
            type: Number,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    computed: {
        peakClass() {
            return {
                played: this.index <= this.$parent.$parent.playedIndex
                    || !this.$parent.$parent.isSame
            };
        },

        peakStyle() {
            return {
                height: Math.floor(Math.max(this.peak, 2) / 1.1) + "px"
            };
        }
    }
};
</script>

<style lang="scss">
.attachments-item-audiomessage-waveform-peak {
    width: 1px;

    background: var(--player-slider);
    pointer-events: none;

    &.played {
        background: var(--secondary);
    }
}
</style>