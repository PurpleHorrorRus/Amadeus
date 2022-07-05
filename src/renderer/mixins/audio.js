import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";

export default {
    mixins: [CoreMixin],
    
    computed: {
        ...mapState({
            playing: state => state.audio.playing,
            song: state => state.audio.song
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