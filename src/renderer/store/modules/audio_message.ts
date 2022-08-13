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
                audio.setSinkId(rootState.settings.settings.outputDevice);
            } catch (e) { audio.setSinkId("default"); }

            audio.onended = () => dispatch("CLEAR");
            audio.ontimeupdate = () => state.time = audio.currentTime;
            audio.oncanplaythrough = () => {
                state.playing = true;
                audio.play();
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