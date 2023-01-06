<template>
    <div class="player-timeline">
        <ProgressLine
            v-if="init"
            id="player-timeline"
            ref="line"
            :value="time"
            :max="song.duration"
            :parentMove="true"
            :tooltipValue="formatTime(tooltipTime)"
            @select="seek"
            @updateTooltip="tooltipTime = $event"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import AudioMixin from "~/mixins/audio";

import common from "~/plugins/common";

export default {
    components: {
        ProgressLine: () => import("~/components/Other/Line.vue")
    },

    mixins: [AudioMixin],

    data: () => ({
        tooltipTime: 0
    }),

    computed: {
        ...mapState({
            init: (state: any) => state.audio.init,
            time: (state: any) => state.audio.time
        })
    },

    methods: {
        ...mapActions({
            seek: "audio/SET_TIME"
        }),

        formatTime(time) {
            return common.fancyTimeFormat(time);
        }
    }
};
</script>

<style lang="scss">
.player-timeline {
    width: 100%;
}
</style>