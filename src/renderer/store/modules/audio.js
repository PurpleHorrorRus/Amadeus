/* eslint-disable no-undef */

const hlsConfig = {
    maxBufferSize: 1024 * 1000 * 1000,
    maxBufferLength: 60,
    maxMaxBufferLength: Infinity,
    enableWorker: false,
    defaultAudioCodec: "mp4a.40.5"
};

let hls = null;
let audioInstance = null;

export default {
    namespaced: true,

    state: () => ({
        song: null,
        playing: false
    }),

    actions: {
        PLAY: async ({ state }, song) => {
            console.log(song);
            state.song = song;
            
            audioInstance = new Audio();
            hls = new Hls(hlsConfig);
            hls.attachMedia(audioInstance);
            hls.loadSource(song.url);
            audioInstance.oncanplaythrough = () => audioInstance.play();

            state.playing = true;
            return true;
        },

        PAUSE: ({ state }) => {
            if (!state.playing) {
                return false;
            }

            audioInstance.pause();
            state.playing = false;
            return true;
        },

        RESUME: ({ state }) => {
            if (state.playing) {
                return false;
            }

            if (hls) hls.startLoad(audioInstance.currentTime);
            audioInstance.play();
            state.playing = true;

            return true;
        },

        CLEAR: ({ state }) => {
            state.song = null;
            state.playing = false;

            audioInstance.pause();
            hls.destroy();

            hls = null;
            audioInstance = null;
        }
    }
};