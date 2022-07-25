<template>
    <div class="player-timeline">
        <VuePlyr ref="plyr">
            <audio />
        </VuePlyr>
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    mounted() {
        this.setPlayer(this.$refs.plyr);
    },

    methods: {
        ...mapActions({
            setPlayer: "audio/SET_PLAYER"
        })
    }
};
</script>

<style lang="scss">
.player-timeline {
    width: 100%;

    --plyr-audio-controls-background: none;
    --plyr-audio-control-color: var(--small-text) !important;
    --plyr-range-fill-background: var(--player-slider-progress);
    --plyr-audio-progress-buffered-background: var(--player-slider);
    --plyr-tooltip-background: var(--tooltip);
    --plyr-tooltip-color: var(--secondary);

    --plyr-range-thumb-height: 0px;
    --plyr-range-track-height: 4px;

    --plyr-font-size-time: 8pt;

    .plyr--audio .plyr__controls {
        padding: 0px !important;
    }

    .plyr__controls {
        display: block;

        width: 100%;

        &:hover {
            --plyr-range-thumb-height: 8px;
            --plyr-range-fill-background: var(--secondary);
        }
    }

    .plyr__tooltip {
        z-index: 900 !important;
    }
}
</style>