<template>
    <div id="messages-player-actions-volume">
        <div id="messages-player-actions-volume-icon">
            <Component
                :is="render.icon"
                :id="render.id"
                class="icon amadeus"
            />
        </div>

        <VolumeLine
            id="messages-player-actions-volume-line"
            :value="settings.player.volume"
            :width="120"
            @change="setVolume"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import VolumeHighIcon from "~icons/volume-high.svg";
import VolumeLowIcon from "~icons/volume-low.svg";
import VolumeMuteIcon from "~icons/volume-mute.svg";

import CoreMixin from "~/mixins/core";

export default {
    components: {
        VolumeLine: () => import("~/components/Global/Line.vue")
    },

    mixins: [CoreMixin],

    computed: {
        ...mapState({
            volume: (state: any) => state.audio.volume
        }),

        render() {
            if (this.volume === 0) {
                return {
                    icon: VolumeMuteIcon,
                    id: "volume-mute"
                };
            }

            if (this.volume < 50) {
                return {
                    icon: VolumeLowIcon,
                    id: "volume-low"
                };
            }

            return {
                icon: VolumeHighIcon,
                id: "volume-high"
            };
        }
    },

    methods: {
        ...mapActions({
            setVolume: "audio/SET_VOLUME"
        })
    }
};
</script>

<style lang="scss">
#messages-player-actions-volume {
    display: flex;
    align-items: center;
    column-gap: 5px;

    width: 100%;

    &-icon {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 25px;

        .icon {
            width: 22px;
        }

        #volume-low, #volume-high {
            position: relative;
        }

        #volume-low {
            right: 2px;
        }

        #volume-high {
            left: 1px;
        }
    }
}
</style>