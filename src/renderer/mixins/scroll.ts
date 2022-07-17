import common from "~/plugins/common";

export default {
    data: () => ({
        refComponent: null,
        scrollPercent: 0,
        trigger: () => {},
        handler: () => {}
    }),

    beforeDestroy() {
        this.refComponent?.removeEventListener("scroll", this.onScroll);
        this.refComponent = null;
        this.scrollPercent = 0;
        this.trigger = () => {};
        this.handler = () => {};
    },

    methods: {
        async registerScroll(refComponent: string | Object, handler: Function, trigger: Function) {
            const element = typeof refComponent === "string"
                ? await this.awaitElement(refComponent)
                : refComponent;

            this.refComponent = element.$el || element;
            this.handler = handler;
            this.trigger = trigger;
            return this.refComponent.addEventListener("scroll", this.onScroll);
        },

        async onScroll(event) {
            this.scrollPercent = (event.target.scrollTop 
                / (event.target.scrollHeight - event.target.clientHeight)) 
                * 100;

            return this.trigger(this.scrollPercent)
                && await this.handler();
        },

        async awaitElement(ref) {
            return this.$refs[ref] || await (async () => {
                await common.wait(100);
                return await this.awaitElement(ref);
            })();
        }
    }
};