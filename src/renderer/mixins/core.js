import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            settings: state => state.settings.settings
        })
    },

    methods: {
        ...mapActions({
            saveSettings: "settings/SAVE",
            saveCustom: "settings/SAVE_CUSTOM"
        })
    }
};