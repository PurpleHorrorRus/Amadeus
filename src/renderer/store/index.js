import Vuex from "vuex";

import vk from "~/store/modules/vk";

export default () => {
    return new Vuex.Store({
        state: () => ({
            extendedView: false
        }),

        actions: {
            SET_CONFIG: ({ state }, config) => {
                state.config = config;
                return state.config;
            },

            SET_VIEW: ({ state }, view) => {
                state.extendedView = view;
                return state.extendedView;
            }
        },

        modules: {
            vk
        }
    });
};