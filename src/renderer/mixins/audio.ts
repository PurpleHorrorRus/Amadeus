import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],
    
    computed: {
        ...mapState({
            playing: (state: any) => state.audio.playing,
            song: (state: any) => state.audio.song
        })
    },

    methods: {
        ...mapActions({
            play: "audio/PLAY",
            pause: "audio/PAUSE",
            resume: "audio/RESUME"
        })
    }
};