import { Store } from "vuex";

import vk from "~/store/modules/vk";
import ipc from "~/store/modules/ipc";
import settings from "~/store/modules/settings";
import input from "~/store/modules/input";
import audio from "~/store/modules/audio";
import audio_message from "~/store/modules/audio_message";
import modal from "~/store/modules/modal";
import updater from "~/store/modules/updater";

export default () => {
    return new Store({
        state: () => ({
            extendedView: false,

            config: {},
            paths: {},

            background: ""
        }),

        actions: {
            SET_CONFIG: async ({ dispatch, state }, config) => {
                state.background = config.background;
                delete config.background;

                state.config = config;
                await dispatch("settings/SET", config.settings);
                return state.config;
            },

            SET_PATHS: ({ state }, paths) => {
                state.paths = paths;
                return state.paths;
            },

            SET_VIEW: ({ state }, view) => {
                state.extendedView = view;
                return state.extendedView;
            },
            
            SET_BACKGROUND: ({ state }, background) => {
                state.background = background;
                return state.config;
            }
        },

        modules: {
            vk,
            ipc,
            settings,
            input,
            audio,
            audio_message,
            modal,
            updater
        }
    });
};