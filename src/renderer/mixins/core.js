import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            client: state => state.vk.client,
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