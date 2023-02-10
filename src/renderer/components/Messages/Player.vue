<template>
    <div id="messages-player">
        <div id="messages-player-play" @click="action">
            <PlayIcon v-if="!playing" class="icon amadeus clickable" />
            <PauseIcon v-else class="icon amadeus clickable" />
        </div>

        <span id="messages-player-song" class="nowrap" v-text="title" />

        <div v-if="playerInitialized" id="messages-player-actions">
            <PlayerTime />
            <PlayerVolume />
            <XIcon
                id="messages-player-actions-remove"
                class="icon amadeus clickable"
                @click="clear"
            />
        </div>

        <Timeline
            v-if="playerInitialized"
            id="messages-player-timeline"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import AudioMixin from "~/mixins/audio";

export default {
    components: {
        Timeline: () => import("~/components/Messages/Player/Timeline.vue"),

        PlayerTime: () => import("~/components/Messages/Player/Time.vue"),
        PlayerVolume: () => import("~/components/Messages/Player/Volume.vue"),

        PlayIcon: () => import("~icons/play.svg"),
        PauseIcon: () => import("~icons/pause.svg"),
        XIcon: () => import("~icons/x.svg")
    },

    mixins: [AudioMixin],

    computed: {
        ...mapState({
            playerInitialized: (state: any) => state.audio.init
        }),

        title() {
            return `${this.song.artist} — ${this.song.title}`;
        }
    },

    methods: {
        ...mapActions({
            resume: "audio/RESUME",
            pause: "audio/PAUSE",
            clear: "audio/CLEAR"
        }),

        action() {
            return this.playing
                ? this.pause()
                : this.resume();
        }
    }
};
</script>

<style lang="scss">
#messages-player {
    grid-area: player;

    display: grid;
    grid-template-columns: 30px 1fr max-content;
    grid-template-rows: 30px 5px;
    grid-template-areas: "play song actions"
                        "timeline timeline timeline";

    align-items: center;
    align-self: flex-start;

    position: sticky;
    top: 0px; left: 0px;

    width: 100%;
    height: 100%;

    background: var(--primary);
    border-bottom: 1px solid var(--border-opacity);

    z-index: 99;

    .icon {
        justify-self: center;
    }

    &-play {
        grid-area: play;

        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            width: 14px;
        }
    }

    &-song {
        grid-area: song;

        padding-right: 10px;

        font-size: 12px;
    }

    &-actions {
        grid-area: actions;

        display: flex;
        align-items: center;
        column-gap: 5px;

        padding-right: 10px;

        &-volume {
            width: 120px;
        }

        &-remove {
            width: 20px;
        }
    }

    &-timeline {
        grid-area: timeline;

        width: 100%;

        padding: 10px;
    }
}
</style>