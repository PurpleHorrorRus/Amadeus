import { mapActions, mapState } from "vuex";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

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
        }),

        formatText(text) {
            return text.split(" ").map(word => {
                return mentionRegex.test(word)
                    ? "@" + word.match(mentionRegex)[2]
                    : word;
            }).join(" ");
        }
    }
};