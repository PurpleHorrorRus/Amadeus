import { mapActions, mapState } from "vuex";

export default {
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
        })
    }
};