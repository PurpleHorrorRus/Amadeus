import Vuex from "vuex";

import vk from "~/store/modules/vk";

export default () => {
    return new Vuex.Store({
        actions: {
            SET_CONFIG: ({ state }, config) => {
                state.config = config;
                return state.config;
            }
        },

        modules: {
            vk
        }
    });
};