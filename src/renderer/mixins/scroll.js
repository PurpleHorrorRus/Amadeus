export default {
    methods: {
        registerScroll(refComponent, handler) {
            refComponent.onscroll = async () => {
                if (!this.canScroll) {
                    return false;
                }

                const diff = refComponent.scrollHeight - refComponent.clientHeight;
                const progress = refComponent.scrollTop / diff;
                const percent = progress * 100;

                if (percent > 80) {
                    await handler();
                    return true;
                }

                return false;
            };

            return true;
        }
    }
};