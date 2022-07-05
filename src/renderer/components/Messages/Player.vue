<template>
    <div id="messages-player">
        <div id="messages-player-action" @click="action">
            <PlayIcon v-if="!playing" class="icon vkgram clickable" />
            <PauseIcon v-else class="icon vkgram clickable" />
        </div>

        <span id="messages-player-song" class="nowrap" v-text="title" />
        <XIcon class="icon clickable" @click="clear" />
    </div>
</template>

<script>
import { mapActions } from "vuex";

import AudioMixin from "~/mixins/audio";

export default {
    components: {
        PlayIcon: () => import("~/assets/icons/play.svg"),
        PauseIcon: () => import("~/assets/icons/pause.svg"),
        XIcon: () => import("~/assets/icons/x.svg")
    },

    mixins: [AudioMixin],

    computed: {
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
    grid-template-columns: 30px 1fr 30px;
    align-items: center;
    align-self: flex-start;

    position: sticky;
    top: 0px; left: 0px;

    width: 100%;
    height: 100%;

    background: var(--primary);
    border-bottom: 1px solid var(--border);

    z-index: 99;

    .icon {
        justify-self: center;

        width: 14px;
    }

    &-action {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &-song {
        font-size: 12px;
    }
}
</style>