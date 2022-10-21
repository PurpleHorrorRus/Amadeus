import fs from "fs";

import { Store } from "vuex";

import vk from "~/store/modules/vk";
import ipc from "~/store/modules/ipc";
import settings from "~/store/modules/settings";
import input from "~/store/modules/input";
import audio from "~/store/modules/audio";
import audio_message from "~/store/modules/audio_message";
import modal from "~/store/modules/modal";
import i18n from "~/store/modules/i18n";
import updater from "~/store/modules/updater";

import Conversation from "~/instances/Conversations/Convesration";

export default () => {
    return new Store({
        state: () => ({
            config: {},
            paths: {},

            background: "var(--primary)"
        }),

        mutations: {
            openConversation(_, conversation: Conversation) {
                const { id, type } = conversation.information.peer;
                return this.$router.replace(`/messages/${id}?type=${type}`).catch(() => (false));
            }
        },

        actions: {
            SET_CONFIG: async ({ dispatch, state }, data) => {
                state.config = data.config;
                state.paths = data.paths;

                // state.background = data.background;
                await dispatch("SET_BACKGROUND", state.background.length > 0);

                await dispatch("settings/SET", data.config.settings);
                return state.config;
            },

            SET_BACKGROUND: ({ state }, setBackground: boolean) => {
                if (setBackground) {
                    const base64 = "data:image/png;base64," + fs.readFileSync(state.paths.background, "base64");
                    state.background = `url("${base64}")`;
                    return base64;
                }

                state.background = "var(--primary)";
                return false;
            },

            OPEN_CONVERSATION: ({ commit }, conversation: Conversation) => {
                return commit("openConversation", conversation);
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
            i18n,
            updater
        }
    });
};