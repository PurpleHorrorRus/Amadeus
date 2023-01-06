import fs from "fs";
import { Store } from "vuex";

import vk from "./modules/vk";
import ipc from "./modules/ipc";
import input from "./modules/input";
import audio from "./modules/audio";
import audio_message from "./modules/audio_message";
import modal from "./modules/modal";
import i18n from "./modules/i18n";
import updater from "./modules/updater";

import Conversation from "~/instances/Conversations/Convesration";

export default () => {
    return new Store({
        state: () => ({
            config: {},
            paths: {},

            background: "var(--primary)"
        }),

        mutations: {
            openConversation (_, conversation: Conversation) {
                const { id, type } = conversation.information.peer;
                return this.$router.replace(`/messages/${id}?type=${type}`)
                    .catch(() => (false));
            }
        },

        actions: {
            SET_CONFIG: async ({ dispatch, state }, data) => {
                for (const key of Object.keys(data.config)) {
                    if (!(key in data.config)) {
                        data.config[key] = {};
                    }

                    data.config[key].save = content => {
                        global.$nuxt.$ipc.send("save", {
                            type: key,
                            content: content || state.config[key]
                        });

                        return data.config[key];
                    };
                }

                state.config = data.config;
                state.paths = data.paths;

                await dispatch("SET_BACKGROUND", state.background.length > 0);
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
            input,
            audio,
            audio_message,
            modal,
            i18n,
            updater
        }
    });
};