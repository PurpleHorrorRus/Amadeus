import { mapState } from "vuex";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

export default {
    computed: {
        ...mapState({
            config: (state: any) => state.config,
            paths: (state: any) => state.paths,
            client: (state: any) => state.vk.client,
            user: (state: any) => state.vk.user,
            current: (state: any) => state.vk.messages.current
        })
    },

    methods: {
        deepChange(category, root, option, value = "") {
            if (!this.config[category]) {
                this.error(`Can't change state: ${category}`);
                return root[option];
            }

            switch (typeof root[option]) {
                case "boolean": {
                    root[option] = !root[option];
                    break;
                }

                case "string": case "number": {
                    if (!value) {
                        return false;
                    }

                    root[option] = value;
                    break;
                }
            }

            this.config[category].save();
            return root[option];
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