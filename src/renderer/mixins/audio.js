import { mapActions, mapState } from "vuex";

export default {
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