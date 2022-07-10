import { mapActions } from "vuex";
import { contrastColor } from "contrast-color";

export default {
    data: () => ({
        themes: [
            {
                id: "vk-black",
                name: "VK Black"
            },

            {
                id: "meridius",
                name: "Meridius"
            }
        ]
    }),

    methods: {
        ...mapActions({
            setBackground: "SET_BACKGROUND"
        }),

        setTheme(name) {
            this.$nuxt.$colorMode.preference = name;
        },

        setStyleVariable(variable, value) {
            document.documentElement.style.setProperty(`--${variable}`, value);
        },

        generateContrast(color) {
            return contrastColor({ 
                bgColor: color
            });
        },

        calculateContrasts({ variable, value }) {
            const contrast = this.generateContrast(value);
            this.setStyleVariable(variable, value);
            this.setStyleVariable(`${variable}-contrast`, contrast);
        }
    }
};