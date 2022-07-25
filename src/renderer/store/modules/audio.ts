/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import lodash from "lodash";

const hlsConfig = {
    maxBufferSize: 1024 * 1000 * 1000,
    maxBufferLength: 60,
    maxMaxBufferLength: Infinity,
    enableWorker: false,
    defaultAudioCodec: "mp4a.40.5"
};

let hls = null;
let sound = null;

const saveVolumeDebounce = lodash.debounce((dispatch, settings) => {
    dispatch("settings/SAVE", settings, { root: true });
    return true;
}, 2000);

export default {
    namespaced: true,

    state: () => ({
        init: false,
        song: null,

        volume: 0,
        time: 0,

        playing: false
    }),

    actions: {
        SET_PLAYER: async ({ dispatch }, player) => {
            sound = player;
            return await dispatch("CREATE_PLAYER");
        },

        CREATE_PLAYER: async ({ dispatch, state, rootState }) => {
            hls = new Hls(hlsConfig);
            hls.on(Hls.Events.ERROR, (_event, data) => {
                const { type, fatal } = data;

                if (fatal) {
                    switch (type) {
                        case Hls.ErrorTypes.NETWORK_ERROR: {
                            // eslint-disable-next-line max-len
                            console.error("[HLS]: Fatal network error encountered, try to recover");
                            hls.startLoad();
                            break;
                        }

                        case Hls.ErrorTypes.MEDIA_ERROR: {
                            console.error("[HLS]: Fatal media error encountered, try to recover");
                            hls.recoverMediaError();
                            break;
                        }
                    }
                }
            });

            hls.attachMedia(sound.player.media);
            hls.loadSource(state.song.url);

            try {
                sound.player.media.setSinkId(rootState.settings.settings.outputDevice);
            } catch (e) { sound.player.media.setSinkId("default"); }

            state.volume = await dispatch("CALCULATE_VOLUME", rootState.settings.settings.player.volume);

            sound.player.media.oncanplaythrough = () => {
                sound.player.media.volume = state.volume;
                sound.player.media.play();
            };

            sound.player.media.onended = () => {
                state.playing = false;
                state.time = 0;
            };

            sound.player.media.ontimeupdate = () => {
                state.time = sound.player.media.currentTime;
            };

            state.playing = true;
            return state.song;
        },

        PLAY: async ({ dispatch, state }, song) => {
            if (state.song) {
                await dispatch("DESTROY");
            }

            state.song = song;
            if (!state.init) state.init = true;
            else await dispatch("CREATE_PLAYER");

            return state.song;
        },

        PAUSE: ({ state }) => {
            if (!state.playing) {
                return false;
            }

            sound.player.media.pause();
            state.playing = false;
            return true;
        },

        RESUME: ({ state }) => {
            if (state.playing) {
                return false;
            }

            if (hls) hls.startLoad(sound.player.media.currentTime);
            sound.player.media.play();
            state.playing = true;

            return true;
        },

        CLEAR: async ({ dispatch, state }) => {
            state.init = false;
            state.song = null;
            state.time = 0;
            state.playing = false;

            await dispatch("DESTROY");
            return true;
        },

        DESTROY: () => {
            sound.player.media.pause();
            hls.destroy();
            hls = null;
            return true;
        },

        SET_VOLUME: async ({ dispatch, state, rootState }, volume) => {
            const result = await dispatch("CALCULATE_VOLUME", volume);

            if (sound?.player.media.volume === result) {
                return false;
            }

            sound.player.media.volume = result;
            state.volume = volume;
            rootState.settings.settings.player.volume = Math.floor(volume);

            saveVolumeDebounce(dispatch, rootState.settings.settings);
            return true;
        },

        CALCULATE_VOLUME: async ({ dispatch }, volume) => {
            volume /= 100;
            return await dispatch("LIMIT_VOLUME", volume);
        },

        LIMIT_VOLUME: async (_, volume) => {
            const min = Math.min(volume, 1);
            return Math.max(min, 0);
        }
    }
};