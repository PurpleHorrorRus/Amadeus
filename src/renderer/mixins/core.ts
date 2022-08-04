import { mapActions, mapState } from "vuex";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

export default {
    computed: {
        ...mapState({
            config: (state: any) => state.config,
            paths: (state: any) => state.paths,
            client: (state: any) => state.vk.client,
            user: (state: any) => state.vk.user,
            settings: (state: any) => state.settings.settings,
            current: (state: any) => state.vk.messages.current
        })
    },

    methods: {
        ...mapActions({
            saveSettings: "settings/SAVE",
            saveCustom: "settings/SAVE_CUSTOM"
        }),

        deepChange(category: any, option: string, value: string | number | boolean = "") {
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

        formatText(text: string): string {
            return text.split(" ").map(word => {
                return mentionRegex.test(word)
                    ? "@" + word.match(mentionRegex)[2]
                    : word;
            }).join(" ");
        }
    }
};