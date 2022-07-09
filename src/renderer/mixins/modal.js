import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            modal: state => state.modal
        })
    },

    methods: {
        ...mapActions({
            open: "modal/OPEN",
            close: "modal/CLOSE",
            fire: "modal/FIRE"
        })
    }
};