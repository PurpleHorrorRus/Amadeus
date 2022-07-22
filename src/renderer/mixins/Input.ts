export default {
    props: {
        placeholder: {
            type: String,
            required: false,
            default: ""
        },

        value: {
            type: [String, Number],
            required: false,
            default: ""
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false
        },

        type: {
            type: String,
            required: false,
            default: "text"
        }
    },

    data: () => ({
        mutated: "" as string,
        ctrl: false as boolean
    }),

    watch: {
        value: function(value) {
            this.mutated = value;
        }
    },

    created() {
        this.mutated = this.value;
    },

    methods: {
        input() {
            this.$emit("input", this.mutated);
        },

        enter() {
            if (this.ctrl) {
                this.$emit("enter");
            }
        },

        press({ keyCode }) {
            if (keyCode === 17) {
                this.ctrl = true;
            }
        },

        up({ keyCode }) {
            if (keyCode === 17) {
                this.ctrl = false;
            }
        },

        clear() {
            this.mutated = "";
        }
    }
};