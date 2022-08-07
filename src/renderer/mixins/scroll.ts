import common from "~/plugins/common";

export default {
    data: () => ({
        refComponent: null,
        scrollPercent: 0,
        destroyed: false as boolean,
        trigger: () => (false) as boolean,
        handler: () => ({ }) as unknown
    }),

    beforeDestroy() {
        this.destroyed = true;
        this.refComponent?.removeEventListener("scroll", this.onScroll);
        this.refComponent = null;
        this.scrollPercent = 0;
        this.trigger = () => (false);
        this.handler = () => (false);
    },

    methods: {
        async registerScroll(refComponent: string | Element, handler: Promise<any>, trigger: boolean) {
            if (this.destroyed || !refComponent) {
                return false;
            }

            const element = typeof refComponent === "string"
                ? await this.awaitElement(refComponent)
                : refComponent;

            this.refComponent = element.$el || element;
            this.handler = handler;
            this.trigger = trigger;
            return this.refComponent.addEventListener("scroll", this.onScroll);
        },

        async onScroll(event) {
            this.scrollPercent = Math.abs((
                event.target.scrollTop
                / (event.target.scrollHeight - event.target.clientHeight)) * 100);

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