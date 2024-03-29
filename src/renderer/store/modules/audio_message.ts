let audio = null;

export default {
    namespaced: true,

    state: () => ({
        voice: null,
        playing: false,
        time: 0
    }),

    actions: {
        PLAY: async ({ dispatch, state, rootState }, data) => {
            if (state.playing) {
                await dispatch("CLEAR");
            }

            state.voice = data;

            audio = new Audio(data.link_ogg);

            try {
                audio.setSinkId(rootState.config.general.outputDevice);
            } catch (e) { audio.setSinkId("default"); }

            audio.onended = () => {
                return dispatch("CLEAR");
            };

            audio.ontimeupdate = () => {
                state.time = audio.currentTime;
                return state.time;
            };

            audio.oncanplaythrough = () => {
                state.playing = true;
                return audio.play();
            };

            state.playing = true;
            return state.voice;
        },

        PAUSE: ({ state }) => {
            audio.pause();
            state.playing = false;
            return true;
        },

        RESUME: ({ state }) => {
            audio.play();
            state.playing = true;
            return true;
        },

        SEEK: ({ dispatch }, time) => {
            if (!audio) {
                return false;
            }

            audio.currentTime = time;
            dispatch("RESUME");

            return time;
        },

        CLEAR: async ({ dispatch, state }) => {
            if (!audio) {
                return false;
            }

            await dispatch("PAUSE");
            state.voice = null;
            audio = null;
            return true;
        }
    }
};