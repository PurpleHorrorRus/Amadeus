import { mapActions, mapState } from "vuex";

export default {
    data: () => ({
        handler: () => (false)
    }),

    computed: {
        ...mapState({
            modal: (state: any) => state.modal
        })
    },

    methods: {
        ...mapActions({
            open: "modal/OPEN",
            confirmation: "modal/CONFIRMATION",
            close: "modal/CLOSE"
        }),

        windowEvents(handler: () => any) {
            this.handler = handler;
            window.addEventListener("blur", this.handler);
            window.addEventListener("resize", this.handler);
        },

        closeEvents() {
            window.removeEventListener("blur", this.handler);
            window.removeEventListener("resize", this.handler);
            this.handler = () => (false);
        }
    }
};