export default {
    namespaced: true,

    state: () => ({
        show: false,
        layout: "none",
        view: "none",
        label: "",

        function: () => {},

        confirmation: {
            text: "Окно подтверждения",
            options: [],
            accept: () => {}
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

        CLOSE: ({ state }) => {
            state.show = false;

            if (state.view === "confirmation") {
                state.confirmation.text = [];
                state.confirmation.options = [];
                state.confirmation.accept = () => {};
            } else {
                state.function = () => {};
            }

            state.layout = "none";
            state.view = "none";
            
            return true;
        }
    }
};