import common from "~/plugins/common";

export default {
    namespaced: true,

    state: () => ({}),

    mutations: {
        REDIRECT(_, url) {
            this.$router.replace(url).catch(() => {});
        }
    },

    actions: {
        SHARE: ({ commit, dispatch }, attachment) => {
            dispatch("modal/OPEN", {
                view: "choose-user",
                title: "Поделиться",
                function: async conversation => {
                    commit("REDIRECT", `/messages/${conversation.id}?type=${conversation.type}`);
                    await common.wait(200);
                    return dispatch("input/ADD_ATTACHMENT", attachment, { root: true });
                }
            }, { root: true });
        }
    }
};