import Vuex from "vuex";

import settings from "~/store/settings";
import vk from "~/store/modules/vk";

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
            vk
        }
    });
};