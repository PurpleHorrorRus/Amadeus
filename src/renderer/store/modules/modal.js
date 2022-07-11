export default {
    namespaced: true,

    state: () => ({
        show: false,
        layout: "none",
        view: "none",
        target: null,

        confirmation: {
            text: "Окно подтверждения",
            accept: () => {}
        }
    }),

    actions: {
        OPEN: ({ state }, data) => {
            if (data.target) {
                state.target = data.target;
            }
            
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
            state.target = null;
            return true;
        }
    }
};