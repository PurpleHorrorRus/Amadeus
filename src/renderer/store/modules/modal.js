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
            state.confirmation.accept = async () => {
                dispatch("CLOSE");
                return await data.accept();
            };
            
            return await dispatch("OPEN", {
                layout: "default",
                view: "confirmation"
            });
        },

        CLOSE: ({ state }) => {
            state.show = false;
            state.layout = "none";
            state.view = "none";
            return true;
        }
    }
};