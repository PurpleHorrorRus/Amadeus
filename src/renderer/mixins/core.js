import { mapActions, mapState } from "vuex";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

export default {
    computed: {
        ...mapState({
            config: state => state.config,
            paths: state => state.paths,
            extended: state => state.extendedView,
            client: state => state.vk.client,
            user: state => state.vk.user,
            settings: state => state.settings.settings,
            current: state => state.vk.messages.current
        })
    },

    methods: {
        ...mapActions({
            saveSettings: "settings/SAVE",
            saveCustom: "settings/SAVE_CUSTOM"
        }),

        deepChange(category, option, value = "") {
            switch (typeof category[option]) {
                case "boolean": {
                    category[option] = !category[option];
                    break;
                }

                case "number": {
                    category[option] = value ? Number(value) : Number(!category[option]);
                    break;
                }

                case "string": {
                    category[option] = value;
                    break;
                }
            }

            this.saveSettings(this.settings);
            return category[option];
        },

        formatText(text) {
            return text.split(" ").map(word => {
                return mentionRegex.test(word)
                    ? "@" + word.match(mentionRegex)[2]
                    : word;
            }).join(" ");
        }
    }
};