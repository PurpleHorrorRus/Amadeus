<template>
    <div 
        ref="waveform" 
        class="attachments-item-audiomessage-waveform"
        @click.stop="seekTo"
    >
        <WaveformPeak 
            v-for="(peak, index) of waveform"
            :key="index"
            :peak="peak"
            :index="index"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    components: {
        WaveformPeak: () => import("~/components/Messages/Attachments/AudioMessage/Peak.vue")
    },

    props: {
        waveform: {
            type: Array,
            required: true
        }
    },

    methods: {
        ...mapActions({
            seek: "audio_message/SEEK"
        }),

        seekTo(event) {
            if (!this.$parent.isSame) {
                return false;
            }

            const percent = (event.offsetX / this.$refs.waveform.clientWidth) * 100;
            const time = this.$parent.percent * percent;
            return this.seek(time);
        }
    }
};
</script>

<style lang="scss">
.attachments-item-audiomessage-waveform {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 1px;

    width: 80%;
}
</style>