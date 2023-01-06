/* eslint-disable no-undef */
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
let sound = new Audio();

const saveVolumeDebounce = lodash.debounce(context => {
    return context.save();
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
        PLAY: async ({ dispatch, state }, song) => {
            if (state.song) {
                await dispatch("CLEAR");
            }

            state.song = song;

            if (!state.init) {
                state.init = true;
            }

            await dispatch("CREATE_PLAYER");
            return state.song;
        },

        CREATE_PLAYER: async ({ dispatch, state, rootState }) => {
            hls = new Hls(hlsConfig);

            hls.on(Hls.Events.ERROR, (_event, data) => {
                const { type, fatal } = data;

                if (fatal) {
                    switch (type) {
                        case Hls.ErrorTypes.NETWORK_ERROR: {
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

            sound = new Audio();
            hls.attachMedia(sound);
            hls.loadSource(state.song.url);

            try {
                sound.setSinkId(rootState.config.general.outputDevice);
            } catch (e) { sound.setSinkId("default"); }

            sound.onplay = () => {
                state.playing = true;
            }

            sound.onended = () => {
                state.playing = false;
                state.time = 0;
            };

            sound.ontimeupdate = () => {
                state.time = sound.currentTime;
            };

            state.volume = await dispatch("CALCULATE_VOLUME", rootState.config.player.volume);
            sound.volume = state.volume;
            sound.play();

            return state.song;
        },

        PAUSE: ({ state }) => {
            if (!state.playing) {
                return false;
            }

            sound.pause();
            state.playing = false;
            return true;
        },

        RESUME: ({ state }) => {
            if (state.playing) {
                return false;
            }

            if (hls) hls.startLoad(sound.currentTime);
            sound.play();
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

        DESTROY: async ({ dispatch }) => {
            await dispatch("PAUSE");
            
            hls.destroy();
            hls = null;
            
            return true;
        },

        SET_VOLUME: async ({ dispatch, state, rootState }, volume) => {
            const result = await dispatch("CALCULATE_VOLUME", volume);

            if (sound.volume === result) {
                return false;
            }

            sound.volume = result;
            state.volume = volume;
            rootState.config.player.volume = Math.floor(volume);

            return saveVolumeDebounce(rootState.config.player);
        },

        CALCULATE_VOLUME: async ({ dispatch }, volume) => {
            volume /= 100;
            return await dispatch("LIMIT_VOLUME", volume);
        },

        LIMIT_VOLUME: async (_, volume) => {
            const min = Math.min(volume, 1);
            return Math.max(min, 0);
        },

        SET_TIME: async ({ dispatch, state }, time) => {
            sound.currentTime = time;
            state.time = time;
            return await dispatch("RESUME");
        }
    }
};