import Vuex from "vuex";

import settings from "~/store/modules/settings";
import vk from "~/store/modules/vk";
import audio from "~/store/modules/audio";
import audio_message from "~/store/modules/audio_message";

export default () => {
    return new Vuex.Store({
        state: () => ({
            extendedView: false
        }),

        actions: {
            SET_CONFIG: async ({ dispatch, state }, config) => {
                state.config = config;
                await dispatch("settings/SET", config.settings);
                return state.config;
            },

            SET_VIEW: ({ state }, view) => {
                state.extendedView = view;
                return state.extendedView;
            }
        },

        modules: {
            settings,
            vk,
            audio,
            audio_message
        }
    });
};