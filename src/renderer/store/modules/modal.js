export default {
    namespaced: true,

    state: () => ({
        show: false,
        layout: "none",
        view: "none",
        fire: "none",
        target: null
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

        CLOSE: ({ state }) => {
            state.show = false;
            state.layout = "none";
            state.view = "none";
            state.target = null;
            return true;
        },

        FIRE: ({ state }, fire) => {
            state.fire = fire;
            return state.fire;
        }
    }
};