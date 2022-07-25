export default {
    namespaced: true,

    state: () => ({
        show: false,
        layout: "none",
        view: "none",
        label: "",
        target: null,
        busy: false,

        function: () => {
            return false;
        },

        confirmation: {
            text: "Окно подтверждения",
            options: [],
            accept: () => {
                return false;
            }
        }
    }),

    actions: {
        OPEN: ({ dispatch, state }, data) => {
            if (data.function) {
                state.function = async (...args) => {
                    dispatch("CLOSE");
                    return await data.function(...args);
                };
            }

            state.title = data.title || "";
            state.layout = data.layout || "default";
            state.view = data.view;
            state.target = data.target;
            state.show = true;

            return true;
        },

        CONFIRMATION: async ({ dispatch, state }, data) => {
            state.confirmation.text = data.text;

            if (data.options) {
                state.confirmation.options = data.options;
            }

            state.confirmation.accept = async () => {
                data.accept();
                return dispatch("CLOSE");
            };

            return await dispatch("OPEN", {
                layout: "default",
                view: "confirmation"
            });
        },

        SET_BUSY: ({ state }, busy) => {
            state.busy = busy;
            return state.busy;
        },

        CLOSE: ({ state }) => {
            if (state.busy) {
                return false;
            }

            state.show = false;

            if (state.view === "confirmation") {
                state.confirmation.text = [];
                state.confirmation.options = [];

                state.confirmation.accept = () => {
                    return false;
                };
            } else {
                state.function = () => {
                    return false;
                };
            }

            state.layout = "none";
            state.view = "none";
            state.target = null;

            return true;
        }
    }
};