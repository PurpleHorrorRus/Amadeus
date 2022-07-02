export default {
    data: () => ({
        scrollPercent: 0
    }),

    methods: {
        registerScroll(refComponent, handler) {
            refComponent.onscroll = async () => {
                const diff = refComponent.scrollHeight - refComponent.clientHeight;
                const progress = refComponent.scrollTop / diff;
                this.scrollPercent = progress * 100;
                
                if (!this.canScroll) {
                    return false;
                }

                if (handler && this.scrollPercent > 80) {
                    await handler();
                    return true;
                }

                return false;
            };

            return true;
        }
    }
};