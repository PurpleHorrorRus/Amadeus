export default {
    data: () => ({
        scrollPercent: 0,
        handleNext: false,
        handler: () => {}
    }),

    watch: {
        canScroll: function (canScroll) {
            if (canScroll && this.handleNext) {
                this.handler();
                this.handleNext = false;
            }
        }
    },

    methods: {
        registerScroll(refComponent, handler, percent = scrollPercent => scrollPercent > 80) {
            if (!refComponent) return false;
            this.handler = handler;

            refComponent.onscroll = async () => {
                const diff = refComponent.scrollHeight - refComponent.clientHeight;
                const progress = refComponent.scrollTop / diff;
                this.scrollPercent = progress * 100;

                if (!this.canScroll) {
                    return false;
                }

                if (handler && percent(this.scrollPercent)) {
                    if (this.loadMore) {
                        this.handleNext = true;
                        return false;
                    }

                    await this.handler();
                    this.$nextTick(() => refComponent.scrollTop = refComponent.scrollTop + 20);
                    return true;
                }

                return false;
            };

            return true;
        }
    }
};